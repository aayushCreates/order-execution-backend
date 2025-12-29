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
      //  routing-phase
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "ROUTING" },
      });
      publishOrderEvent(orderId, "ROUTING");

      // building-phase
      const route = await router.getBestRoute();
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "BUILDING", selectedDex: route.dex },
      });
      publishOrderEvent(orderId, "BUILDING");

      // execution-phase
      const result = await router.executeSwap(route.dex);

      //  confirmed-phase
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "CONFIRMED",
          executedPrice: result.executedPrice,
          txHash: result.txHash,
        },
      });
      publishOrderEvent(orderId, "CONFIRMED", result);
    } catch (err: any) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "FAILED",
          errorReason: err.message,
        },
      });
      publishOrderEvent(orderId, "FAILED", { error: err.message });
      throw err;
    }
  },
  {
    connection: redisConnection,
  }
);
