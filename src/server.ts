import dotenv from 'dotenv';
import cors from "@fastify/cors";
import { orderRouter} from './routes/order.routes';
import { authRouter } from './routes/auth.routes';
import fastify from 'fastify';

const app = fastify({
    logger: true
});

dotenv.config();

app.register(cors, {
    origin: ["http://localhost:3000", "http://localhost:3030"],
  });


app.register(authRouter, { prefix: '/api/auth' });
app.register(orderRouter, { prefix: '/api/orders' });

const port = Number(process.env.PORT) || 8080;

app.listen({ port }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server running at ${address}`);
});
