import { Worker } from "bullmq";
import { PrismaClient } from "@prisma/client";
import { MockDexRouter } from "../dex/mockDex";
import { publishOrderEvent } from "../ws/order.ws";
import { redisConnection } from "../config/redis.config";

const prisma = new PrismaClient();
const router = new MockDexRouter();

export const orderWorker = new Worker(
  "process-order",
  async (job) => {
    const { orderId } = job.data;

    try {
      console.log(`\n==============================`);
      console.log(`[OrderWorker] START Processing order: ${orderId}`);
      console.log(`[OrderWorker] Attempt: ${job.attemptsMade + 1}`);
      console.log(`==============================`);

      if (job.attemptsMade > 3) {
        console.log(`[OrderWorker] Maximum attempts reached for order ${orderId}. Marking as FAILED.`);
        await prisma.order.update({
          where: { id: orderId },
          data: { status: "FAILED" },
        });
        return;
      }

      // ROUTING PHASE
      console.log(`[OrderWorker][${orderId}] Phase: ROUTING`);
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "ROUTING" },
      });
      publishOrderEvent(orderId, "ROUTING");

      // BUILDING PHASE
      console.log(`[OrderWorker][${orderId}] Phase: BUILDING`);
      const route = await router.getBestRoute();
      console.log(`[OrderWorker][${orderId}] Selected Route: ${route.dex} at price ${route.price}`);

      await prisma.order.update({
        where: { id: orderId },
        data: { status: "BUILDING", selectedDex: route.dex },
      });
      publishOrderEvent(orderId, "BUILDING");

      // EXECUTION PHASE
      console.log(`[OrderWorker][${orderId}] Phase: EXECUTION on ${route.dex}`);
      const result = await router.executeSwap(route.dex);
      console.log(`[OrderWorker][${orderId}] Execution result: TxHash=${result.txHash}, ExecutedPrice=${result.executedPrice}`);

      // CONFIRMED PHASE
      console.log(`[OrderWorker][${orderId}] Phase: CONFIRMED`);
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "CONFIRMED",
          executedPrice: result.executedPrice,
          txHash: result.txHash,
        },
      });
      publishOrderEvent(orderId, "CONFIRMED", result);

      console.log(`[OrderWorker] ✅ Successfully processed order: ${orderId}`);

    } catch (err: any) {
      console.error(`[OrderWorker] ❌ Error processing order ${orderId}:`, err.message);
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "FAILED",
          errorReason: err.message,
        },
      });
      publishOrderEvent(orderId, "FAILED", { error: err.message });
      throw err;
    } finally {
      console.log(`\n==============================`);
      console.log(`[OrderWorker] END Processing order: ${orderId}`);
      console.log(`==============================\n`);
    }
  },
  {
    connection: redisConnection,
  }
);
