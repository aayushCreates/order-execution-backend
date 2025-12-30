import dotenv from "dotenv";
dotenv.config();

import cors from "@fastify/cors";
import { orderRouter } from "./routes/order.routes";
import { authRouter } from "./routes/auth.routes";
import fastify from "fastify";
import websocket from "@fastify/websocket";
import { wsRouter } from "./routes/ws.routes";

const app = fastify({
  logger: true,
});

app.register(cors, {
  origin: ["http://localhost:3000", "http://localhost:3030"],
});

app.register(websocket);

app.register(authRouter, { prefix: "/api/auth" });
app.register(orderRouter, { prefix: "/api/orders" });
app.register(wsRouter, { prefix: "/api/ws/orders" });

const port = Number(process.env.PORT) || 8080;

app.listen({ port }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server running at ${address}`);
});
