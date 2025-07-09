import { Router } from 'express';
import {protect} from "../middleware/auth.middleware.js";
import {createRazorpayOrder, getRazorpayKey, verifyRazorpayPayment} from "../controller/payment.controller.js";

const paymentRouter = Router();

paymentRouter.post('/create-order', protect, createRazorpayOrder);
paymentRouter.post('/verify-payment', protect, verifyRazorpayPayment);
paymentRouter.get('/get-key', protect, getRazorpayKey);

export default paymentRouter;