import { redisPub } from "../config/redis.config";

export const publishOrderEvent = async (
    orderId: string,
    status: string,
    data?: any
  )=> {
    redisPub.publish(
      `order:${orderId}`,
      JSON.stringify({ status, ...data })
    );
  }

