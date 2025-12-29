import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import orderRouter from './routes/order.routes';
import authRouter from './routes/auth.routes';

const app = express();

dotenv.config();

app.use(express.json());

app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3030"]
}));

app.use(morgan("dev"));

app.use('/api/auth', authRouter);
app.use('/api/orders', orderRouter);

const port = process.env.PORT || 8080;
app.listen(port, ()=> {
    console.log("Server is running on port " + port + "🚀");
});
