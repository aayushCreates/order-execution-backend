import { PrismaClient } from "@prisma/client";
import { OrderService } from "../services/order.service";
import { FastifyReply, FastifyRequest } from "fastify";

const prisma = new PrismaClient();

export const getOrder = async (req: FastifyRequest, reply: FastifyReply)=> {
    try {
        const { id } = req.params as any;

        const order = await prisma.order.findUnique({
          where: { id: id },
        });
      
        if (!order) {
          return reply.status(404).send({ message: "Order not found" });
        }

        return reply.status(200).send({
            success: true,
            message: "Order status got successfully",
            data: order
        });
    }catch(err) {
        console.log("Error in getting order", err);
    }
}

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

        if(amount <= 0) {
            return reply.status(400).send({
                success: false,
                message: "Invalid entered amount"
        });
        }

        const order = await OrderService.createOrder({
            tokenIn, tokenOut, amount, userId
        });

        return reply.status(200).send({
            success: true,
            message: "Order initiated successfully",
            data: {
                userId: user?.id,
                orderId: order.id,
                wsUrl: `/api/ws/orders/${order.id}`,
            }
          });
    }catch(err) {
        console.log("Error in placing order", err);
    }      
}

export const getOrderStatus = async (req: FastifyRequest, reply: FastifyReply)=> {
    try {
        const { id } = req.params as any;

        const order = await prisma.order.findUnique({
          where: { id: id },
        });
      
        if (!order) {
          return reply.status(404).send({ message: "Order not found" });
        }

        return reply.status(200).send({
            success: true,
            message: "Order status got successfully",
            data: order
        });
    }catch(err) {
        console.log("Error in getting order status", err);
    }
}

