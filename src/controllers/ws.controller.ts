import { WebSocket } from "@fastify/websocket";
import { FastifyRequest } from "fastify";
import { WebSocketService } from "../services/ws.service";

export const getOrderInfo = async (
  socket: WebSocket,
  req: FastifyRequest
) => {
  try {
    const { orderId } = req.params as any;

    if (!orderId) {
      socket.close();
      return;
    }

    WebSocketService.subscribeToOrder(socket, orderId);
  } catch (err) {
    console.error("Server error in websocket controller", err);
    socket.close();
  }
};
