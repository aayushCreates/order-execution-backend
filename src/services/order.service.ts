import { PrismaClient } from "@prisma/client";
import orderQueue from "../queues/order.queue";
import { CreatedOrder } from "../types/order.types";

const prisma = new PrismaClient();

export class OrderService {
  static async createOrder(data: CreatedOrder) {
    const order = await prisma.order.create({
      data: {
        tokenIn: data.tokenIn,
        tokenOut: data.tokenOut,
        amount: data.amount,
        userId: data.userId,
        status: "PENDING"
      },
    });

    await orderQueue.add("execute-order", {
        orderId: order.id,
      }, {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000,
        }
      });
    
    return order;
  }
}
