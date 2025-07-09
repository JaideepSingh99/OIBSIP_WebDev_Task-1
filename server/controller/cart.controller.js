import {ApiError, asyncHandler} from "../middleware/error.middleware.js";
import Cart from "../models/cart.model.js";
import Pizza from "../models/pizza.model.js";
import CustomPizza from "../models/custompizza.model.js";

export const getCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ userId: req.user._id }).populate('items.pizza');
  res.status(200).json({
    success: true,
    cart
  });
});

export const addToCart = asyncHandler(async (req, res, next) => {
  const { itemType, pizza, size, quantity = 1 } = req.body;
  let price = 0;

  if(!itemType || !pizza) throw new ApiError(400, 'Invalid item');

  if(itemType === 'Pizza') {
    const pizzaDoc = await Pizza.findById(pizza);
    if(!pizzaDoc) {
      return res.status(400).json({ success: false, message: 'Pizza not found' });
    }
    price = pizzaDoc.sizePrices[size];
  } else if(itemType === 'CustomPizza') {
    const custom = await CustomPizza.findById(pizza);
    if(!custom || custom.userId.toString() !== req.user._id.toString()) throw new ApiError(400, 'Invalid custom pizza');
    price = custom.totalPrice;
  } else {
    return res.status(400).json({ success: false, message: 'Invalid item type' });
  }

  let cart = await Cart.findOne({ userId: req.user._id });
  if(!cart) {
    cart = new Cart({ userId: req.user._id, items: [], totalPrice: 0 });
  }

  cart.items.push({ itemType, pizza, size, quantity, price });
  cart.totalPrice += price * quantity;
  await cart.save();

  res.status(200).json({
    success: true,
    message: 'Item added to cart successfully',
    cart,
  });
});

export const updateCartItem = asyncHandler(async (req, res, next) => {
  const { itemIndex, quantity, size } = req.body;
  const cart = await Cart.findOne({ userId: req.user._id });
  if(!cart || !cart.items[itemIndex]) throw new ApiError(400, 'Item not found');

  const item = cart.items[itemIndex];

  if(size && item.itemType === 'Pizza') {
    const pizzaDoc = await Pizza.findById(item.pizza);
    if(!pizzaDoc) throw new ApiError(400, 'Pizza not found');
    item.price = pizzaDoc.sizePrices[size];
    item.size = size;
  }

  if(quantity) item.quantity = quantity;

  cart.totalPrice = cart.items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
  await cart.save();

  res.status(200).json({
    success: true,
    cart,
  });
});

export const removeCartItem = asyncHandler(async (req, res, next) => {
  const { itemIndex } = req.params;
  const cart = await Cart.findOne({ userId: req.user._id });
  if(!cart || !cart.items[itemIndex]) throw new ApiError(400, 'Item not found');

  cart.items.splice(itemIndex, 1);
  cart.totalPrice = cart.items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
  await cart.save();

  res.status(200).json({
    success: true,
    message: 'Item removed from cart successfully',
    cart
  });
});

export const clearCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [], totalPrice: 0});

  res.status(200).json({
    success: true,
    message: 'Cart cleared successfully',
  });
});