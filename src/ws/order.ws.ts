import { redisPub } from "../config/redis.config";

const publishOrderEvent = async (
    orderId: string,
    status: string,
    data?: any
  )=> {
    redisPub.publish(
      `order:${orderId}`,
      JSON.stringify({ status, ...data })
    );
  }

export default publishOrderEvent;
