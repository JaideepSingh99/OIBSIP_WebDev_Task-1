import {ApiError, asyncHandler} from "../middleware/error.middleware.js";
import Pizza from "../models/pizza.model.js";
import CustomPizza from "../models/custompizza.model.js";
import Ingredient from "../models/ingredient.model.js";
import Order from "../models/order.model.js";
import {checkAndNotifyLowStock} from "../utils/checkAndNotifyLowStock.js";
import {updatePizzaAvailability} from "../utils/updatePizzaAvailability.js";
import {updateIngredientAvailability} from "../utils/updateIngredientAvailability.js";

export const placeOrder = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { items, deliveryAddress, paymentMethod } = req.body;

  if(!items || items.length === 0) {
    throw new ApiError(400, 'No items in the cart');
  }

  let totalAmount = 0;
  let finalItems = [];

  for(const item of items) {
    let itemPrice = 0;
    let pizzaRef;

    if(item.itemType === 'Pizza') {
      const pizza = await Pizza.findById(item.pizza).populate('ingredients');
      if(!pizza || !pizza.isAvailable || pizza.isDeleted) {
        throw new ApiError(400, 'Pizza not found');
      }

      const priceForSize = pizza.sizePrices[item.size];
      if(!priceForSize) {
        throw new ApiError(400, 'Pizza size not found');
      }

      for (const ing of pizza.ingredients) {
        if (!ing.isAvailable) {
          throw new ApiError(400, `Ingredient "${ing.name}" is not available`);
        }
        if (ing.stock <= 0) {
          throw new ApiError(400, `Ingredient "${ing.name}" is out of stock`);
        }
        ing.stock -= 1;
        await ing.save();
      }

      itemPrice = priceForSize;
      pizzaRef = pizza._id;
    } else if(item.itemType === 'CustomPizza') {
      const customPizza = await CustomPizza.findById(item.pizza);
      if(!customPizza || customPizza.userId.toString() !== userId.toString()) {
        throw new ApiError(400, 'Custom pizza not found or not owned by the user');
      }

      if(customPizza.isOrdered) {
        throw new ApiError(400, 'Custom pizza already ordered');
      }

      itemPrice = customPizza.totalPrice;
      pizzaRef = customPizza._id;

      const ingredientIds = [
        customPizza.base,
        customPizza.sauce,
        customPizza.cheese,
        ...customPizza.vegetables,
        ...customPizza.meats
      ];

      const ingredients = await Ingredient.find({_id: {$in: ingredientIds}, isAvailable: true });

      if(ingredients.length !== ingredientIds.length) {
        throw new ApiError(400, 'Some ingredients are not available');
      }

      for(const ing of ingredients) {
        if(ing.stock <= 0) {
          throw new ApiError(400, `Ingredient "${ing.name}" is out of stock`);
        }
        ing.stock -= 1;
        await ing.save();
      }

      customPizza.isOrdered = true;
      await customPizza.save()
    }

    const quantity = item.quantity || 1;
    totalAmount += itemPrice * quantity;

    finalItems.push({
      itemType: item.itemType,
      pizza: pizzaRef,
      size: item.size,
      quantity,
      price: itemPrice
    });
  }

  const order = await Order.create({
    userId,
    items: finalItems,
    totalAmount,
    deliveryAddress,
    paymentMethod,
    paymentStatus: paymentMethod === 'cash' ? 'paid' : 'pending',
    orderStatus: 'pending',
  });

  const io = req.app.get('io');

  io.to(userId.toString()).emit('orderPlaced', {
    orderId: order._id,
    orderStatus: order.orderStatus,
    totalAmount: order.totalAmount
  });

  io.emit('newOrderPlaced', {
    orderId: order._id,
    userId: userId.toString(),
    totalAmount: order.totalAmount
  });

  await checkAndNotifyLowStock();
  await updateIngredientAvailability();
  await updatePizzaAvailability();

  res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    order,
  });
});

export const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const { orderStatus } = req.body;

  const allowedStatuses = ['pending', 'received', 'inKitchen', 'outForDelivery' , 'delivered', 'cancelled'];
  if(!allowedStatuses.includes(orderStatus)) {
    throw new ApiError(400, 'Invalid order status update');
  }

  const order = await Order.findById(orderId);
  if(!order) {
    throw new ApiError(404, 'Order not found');
  }

  order.orderStatus = orderStatus;
  await order.save();

  const io = req.app.get('io');

  io.to(order.userId.toString()).emit('orderStatusUpdated', {
    orderId: order._id,
    newStatus: orderStatus
  });

  res.status(200).json({
    success: true,
    message: `Order status updated to ${orderStatus} successfully`,
    order,
  });
});

export const cancelOrder = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const userId = req.user._id;
  const isAdmin = req.user.role === 'admin';

  const order = await Order.findById(orderId);
  if(!order) {
    throw new ApiError(404, 'Order not found');
  }

  if(!isAdmin && order.userId.toString() !== userId.toString()) {
    throw new ApiError(403, 'You are not authorized to cancel this order');
  }

  if(order.orderStatus === 'cancelled' || order.isCancelled) {
    throw new ApiError(400, 'Order already cancelled');
  }

  if(!['pending', 'received'].includes(order.orderStatus)) {
    throw new ApiError(400, 'Cannot cancel this order at this stage');
  }

  order.orderStatus = 'cancelled';
  order.isCancelled = true;
  await order.save();

  const io = req.app.get('io');
  io.to(order.userId.toString()).emit('orderCancelled', {
    orderId: order._id,
  });

  res.status(200).json({
    success: true,
    message: 'Order cancelled successfully',
    order,
  });
});

export const getMyOrders = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const orders = await Order.find({ userId, isCancelled: false })
    .sort({createdAt: -1})
    .populate('items.pizza');

  res.status(200).json({
    success: true,
    orders
  });
});

export const getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find()
    .sort({createdAt: -1})
    .populate('userId', 'email')
    .populate('items.pizza');

  res.status(200).json({
    success: true,
    orders
  });
});