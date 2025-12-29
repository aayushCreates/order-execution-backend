import { FastifyInstance } from "fastify";
import { placeOrder } from "../controllers/order.controller";
import { isUserLoggedIn } from "../middlewares/auth.middleware";


export async function orderRouter(fastify: FastifyInstance) {
    fastify.post('/execute', { preHandler: isUserLoggedIn }, placeOrder);

}