import {asyncHandler} from "../middleware/error.middleware.js";
import razorpay from "../config/razorpay.js";
import {RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET} from "../config/env.js";
import Order from "../models/order.model.js";
import crypto from 'crypto';

export const createRazorpayOrder = asyncHandler(async (req, res, next) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid amount' });
  }

  const razorpayOrder = await razorpay.orders.create({
    amount: amount * 100,
    currency: 'INR',
    receipt: `receipt_${Date.now()}`
  });

  res.status(201).json({
    success: true,
    orderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency
  });
});

import Pizza from "../models/pizza.model.js";
import CustomPizza from "../models/custompizza.model.js";

export const verifyRazorpayPayment = asyncHandler(async (req, res, next) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    items,
    deliveryAddress,
    totalAmount,
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({
      success: false,
      message: "Invalid signature",
    });
  }

  let finalItems = [];
  let calculatedTotal = 0;

  for (const item of items) {
    let price = 0;

    if (item.itemType === "Pizza") {
      const pizza = await Pizza.findById(item.pizza);
      if (!pizza || pizza.isDeleted || !pizza.isAvailable) {
        return res.status(400).json({ success: false, message: "Pizza not found" });
      }

      price = pizza.sizePrices[item.size];
      if (!price) {
        return res.status(400).json({ success: false, message: "Invalid pizza size" });
      }
    }

    if (item.itemType === "CustomPizza") {
      const customPizza = await CustomPizza.findById(item.pizza);
      if (!customPizza || customPizza.userId.toString() !== req.user._id.toString()) {
        return res.status(400).json({ success: false, message: "Invalid custom pizza" });
      }

      if (customPizza.isOrdered) {
        return res.status(400).json({ success: false, message: "Custom pizza already ordered" });
      }

      price = customPizza.totalPrice;
      customPizza.isOrdered = true;
      await customPizza.save();
    }

    const quantity = item.quantity || 1;
    calculatedTotal += price * quantity;

    finalItems.push({
      itemType: item.itemType,
      pizza: item.pizza,
      size: item.size,
      quantity,
      price,
    });
  }

  if (Math.abs(calculatedTotal - totalAmount) > 1) {
    return res.status(400).json({
      success: false,
      message: "Total amount mismatch",
    });
  }

  const order = await Order.create({
    userId: req.user._id,
    items: finalItems,
    deliveryAddress,
    totalAmount: calculatedTotal,
    paymentMethod: "online",
    paymentStatus: "paid",
    orderStatus: "pending",
  });

  res.status(200).json({
    success: true,
    message: "Payment verified and order placed successfully",
    order,
  });
});


export const getRazorpayKey = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    key: RAZORPAY_KEY_ID
  });
});