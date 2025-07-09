import { Router } from 'express';
import {cancelOrder, getMyOrders, placeOrder} from "../controller/order.controller.js";
import {protect} from "../middleware/auth.middleware.js";
import {validate} from "../middleware/validate.middleware.js";
import {placeOrderSchema} from "../validators/order.validator.js";

const orderRouter = Router();

orderRouter.use(protect);

orderRouter.post('/placeOrder', validate(placeOrderSchema), placeOrder);
orderRouter.patch('/:orderId/cancel', cancelOrder);
orderRouter.get('/my-orders', getMyOrders);

export default orderRouter;