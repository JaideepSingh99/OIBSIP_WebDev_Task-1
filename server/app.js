import express from 'express';
import cookieParser from 'cookie-parser';
import connectToDatabase from "./database/mongodb.js";
import {errorMiddleware, notFoundHandler} from "./middleware/error.middleware.js";
import {PORT} from "./config/env.js";
import { createServer } from "http";
import cors from 'cors'
import {Server} from "socket.io";
import authRouter from "./routes/auth.route.js";
import orderRouter from "./routes/order.route.js";
import adminRouter from "./routes/admin.route.js";
import paymentRouter from "./routes/payment.route.js";
import pizzaRouter from "./routes/pizza.route.js";
import ingredientRouter from "./routes/ingredient.route.js";
import customPizzaRouter from "./routes/customPizza.route.js";
import cartRouter from "./routes/cart.route.js";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set('io', io);

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/payment', paymentRouter);
app.use('/api/v1/pizzas', pizzaRouter);
app.use('/api/v1/ingredients', ingredientRouter);
app.use('/api/v1/custom-pizzas', customPizzaRouter);
app.use('/api/v1/cart', cartRouter);

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User joined: ${userId}`);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

app.get('/', (req, res) => {
  res.send('Pizza Api Running!');
});

app.use(errorMiddleware);
app.use(notFoundHandler);

server.listen(PORT, async () => {
  console.log('Server is running on http://localhost:5000');
  await connectToDatabase();
});