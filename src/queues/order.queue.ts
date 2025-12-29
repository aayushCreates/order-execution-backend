import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.config";

const orderQueue = new Queue("process-order", {
    connection: redisConnection
});


export default orderQueue;