import { FastifyInstance } from "fastify";
import { getOrder, getOrderStatus, placeOrder } from "../controllers/order.controller";
import { isUserLoggedIn } from "../middlewares/auth.middleware";


export async function orderRouter(fastify: FastifyInstance) {
    fastify.get("/:id", { preHandler: isUserLoggedIn }, getOrder);
    fastify.post('/execute', { preHandler: isUserLoggedIn }, placeOrder);
    fastify.get("/:id/status", { preHandler: isUserLoggedIn }, getOrderStatus);
}