import { FastifyInstance } from "fastify";
import { getOrderInfo } from "../controllers/ws.controller";

export async function wsRouter (fastify: FastifyInstance){
    fastify.get('/:orderId', { websocket: true }, getOrderInfo);
}


