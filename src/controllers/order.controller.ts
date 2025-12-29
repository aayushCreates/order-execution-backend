import { OrderService } from "../services/order.service";
import { FastifyReply, FastifyRequest } from "fastify";

export const placeOrder = async (req: FastifyRequest,
    reply: FastifyReply)=> {
    try {
        const user = req.user;
        const userId = user?.id as string;

        const { tokenIn, tokenOut, amount } = req.body as any;
        if(!tokenIn || !tokenOut || !amount) {
            return reply.status(400).send({
                    success: false,
                    message: "Required fields are missing"
            });
        };

        const order = await OrderService.createOrder({
            tokenIn, tokenOut, amount, userId
        });

        return reply.send({
            success: true,
            message: "Order initiated successfully",
            data: {
                userId: user?.id,
                orderId: order.id,
                wsUrl: `/ws/orders/${order.id}`,
            }
          });
    }catch(err) {
        console.log("Error in placing order", err);
    }      
}