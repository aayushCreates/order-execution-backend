import { WebSocket } from "@fastify/websocket";
import { redisSub } from "../config/redis.config";

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
  static subscribeToOrder(socket: WebSocket, orderId: string) {
    const channel = `order:${orderId}`;

    console.log(`🔌 WS connected for order: ${orderId}`);

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
