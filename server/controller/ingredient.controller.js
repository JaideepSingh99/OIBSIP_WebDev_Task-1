import {ApiError, asyncHandler} from "../middleware/error.middleware.js";
import Ingredient from "../models/ingredient.model.js";
import {updatePizzaAvailability} from "../utils/updatePizzaAvailability.js";
import {updateIngredientAvailability} from "../utils/updateIngredientAvailability.js";

// User
export const getAvailableIngredients = asyncHandler(async (req, res, next) => {
  const ingredients = await Ingredient.find({
    stock: {$gt: 0},
    isAvailable: true,
    isDeleted: false
  });

  const grouped = ingredients.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {});

  res.status(200).json({
    success: true,
    ingredients: grouped,
  });
});

// Admin
export const getAllIngredients = asyncHandler(async (req, res, next) => {
  const ingredients = await Ingredient.find({
    isDeleted: false
  });
  res.status(200).json({
    success: true,
    ingredients,
  });
});

export const createIngredient = asyncHandler(async (req, res, next) => {
  const {name, type, price, sizePrices, stock, threshold} = req.body;

  const existing = await Ingredient.findOne({name});
  if (existing) {
    throw new ApiError(409, 'Ingredient already exists');
  }

  const newIngredient = await Ingredient.create({
    name,
    type,
    price,
    sizePrices,
    stock,
    threshold,
  });

  res.status(201).json({
    success: true,
    ingredient: newIngredient,
  });
});

export const updateIngredient = asyncHandler(async (req, res, next) => {
  const {id} = req.params;
  const updatedData = req.body;

  const ingredient = await Ingredient.findById(id);
  if (!ingredient) {
    throw new ApiError(404, 'Ingredient not found');
  }

  Object.assign(ingredient, updatedData);
  await ingredient.save();

  await updateIngredientAvailability();
  await updatePizzaAvailability();

  res.status(200).json({
    success: true,
    ingredient,
  });
});

export const deleteIngredient = asyncHandler(async (req, res, next) => {
  const {id} = req.params;

  const ingredient = await Ingredient.findById(id);
  if (!ingredient) {
    throw new ApiError(404, 'Ingredient not found');
  }

  ingredient.isDeleted = true;
  ingredient.isAvailable = false;

  await ingredient.save();

  res.status(200).json({
    success: true,
    message: 'Ingredient deleted successfully',
  });
});