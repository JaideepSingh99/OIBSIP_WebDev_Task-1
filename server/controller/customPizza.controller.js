import {ApiError, asyncHandler} from "../middleware/error.middleware.js";
import Ingredient from "../models/ingredient.model.js";
import CustomPizza from "../models/custompizza.model.js";
import Cart from "../models/cart.model.js";

export const createCustomPizza = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const {
    name,
    base,
    size,
    sauce,
    cheese,
    vegetables = [],
    meats = [],
    quantity = 1,
  } = req.body;

  if(!base || !size || !sauce || !cheese) {
    throw new ApiError(400, 'Please provide all required fields');
  }

  const ingredientIds = [base, sauce, cheese, ...vegetables, ...meats];
  const ingredients = await Ingredient.find({ _id: { $in: ingredientIds }, isAvailable: true });

  if(ingredients.length !== ingredientIds.length) {
    throw new ApiError(400, 'Some ingredients are not available');
  }

  let totalPrice = 0;

  for(const ing of ingredients) {
    if(ing.type === 'base') {
      totalPrice += ing.sizePrices[size];
    } else {
      totalPrice += ing.price;
    }
  }

  totalPrice *= quantity;

  const customPizza = await CustomPizza.create({
    userId,
    name,
    base,
    sauce,
    cheese,
    vegetables,
    meats,
    size,
    quantity,
    totalPrice,
  });

  let cart = await Cart.findOne({ userId });
  if(!cart) {
    cart = new Cart({ userId, items: [], totalPrice: 0 });
  }

  cart.items.push({
    itemType: 'CustomPizza',
    pizza: customPizza._id,
    size,
    quantity,
    price: totalPrice
  });

  cart.totalPrice += totalPrice;
  await cart.save();

  res.status(201).json({
    success: true,
    message: 'Custom pizza created successfully',
    pizza: customPizza,
    cart
  });
});

export const getCustomPizzas = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const customPizzas = await CustomPizza.find({userId, isOrdered: false}).populate('base sauce cheese vegetables meats').sort({createdAt: -1});

  res.status(200).json({
    success: true,
    customPizzas,
  });
});

export const getMyCustomPizza = asyncHandler(async (req, res, next) => {
  const pizzas = await CustomPizza.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    pizzas
  });
});

export const updateCustomPizza = asyncHandler(async (req, res, next) => {
  const pizza = await CustomPizza.findOne({ _id: req.params.id, userId: req.user._id });
  if(!pizza) return res.status(404).json({
    success: false,
    message: 'Custom pizza not found'
  });

  Object.assign(pizza, req.body);
  await pizza.save();

  res.status(200).json({
    success: true,
    message: 'Custom pizza updated successfully',
    pizza
  });
});

export const deleteCustomPizza = asyncHandler(async (req, res, next) => {
  const pizza = await CustomPizza.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if(!pizza) return res.status(404).json({
    success: false,
    message: 'Custom pizza not found'
  });

  res.status(200).json({
    success: true,
    message: 'Custom pizza deleted successfully',
  });
});