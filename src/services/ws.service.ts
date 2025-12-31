import { WebSocket } from "@fastify/websocket";
import { redisSub } from "../config/redis.config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const socketMap = new Map<string, Set<WebSocket>>();

redisSub.on("message", (channel, message) => {
  const sockets = socketMap.get(channel);
  if (sockets) {
    sockets.forEach((socket) => {
      socket.send(message);
    });
  }
});

export class WebSocketService {
  static async subscribeToOrder(socket: WebSocket, orderId: string) {
    const channel = `order:${orderId}`;

    console.log(`🔌 WS connected for order: ${orderId}`);

    // Send current status immediately
    const order = await prisma.order.findUnique({
        where: { id: orderId }
    });

    if(order) {
        socket.send(JSON.stringify({ status: order.status, ...order }));
    }

    if (!socketMap.has(channel)) {
      socketMap.set(channel, new Set());
      redisSub.subscribe(channel);
    }
    
    const sockets = socketMap.get(channel)!;
    sockets.add(socket);

    socket.on("close", () => {
      console.log(`❌ WS closed for order: ${orderId}`);
      sockets.delete(socket);
      if (sockets.size === 0) {
        redisSub.unsubscribe(channel);
        socketMap.delete(channel);
      }
    });
    
    socket.on("error", () => {
      sockets.delete(socket);
    });
  }
}
