import {ApiError, asyncHandler} from "../middleware/error.middleware.js";
import Pizza from "../models/pizza.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import {updatePizzaAvailability} from "../utils/updatePizzaAvailability.js";

// User
export const getAllPizzas = asyncHandler(async (req, res, next) => {
  const pizzas = await Pizza.find({ isDeleted: false, isAvailable: true })
    .populate('ingredients');

  res.status(200).json({
    success: true,
    pizzas,
  });
});

// Admin
export const getAllPizzasAdmin = asyncHandler(async (req, res, next) => {
  const pizzas = await Pizza.find({ isDeleted: false }).populate('ingredients');
  if(!pizzas) {
    return res.status(404).json({
      success: false,
      message: 'Pizzas not found'
    });
  }

  res.status(200).json({
    success: true,
    pizzas
  });
});

export const createPizza = asyncHandler(async (req, res, next) => {
  const { name, description, ingredients, sizePrices } = req.body;

  const existing = await Pizza.findOne({name});
  if(existing) throw new ApiError(400, 'Pizza already exists');

  const imageUrl = await uploadOnCloudinary(req.file.path);

  const pizza = await Pizza.create({
    name,
    description,
    image: imageUrl,
    ingredients,
    sizePrices,
  });

  res.status(201).json({
    success: true,
    pizza,
  });
});

export const updatePizza = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updatedData = req.body;

  const pizza = await Pizza.findById(id);
  if (!pizza) throw new ApiError(404, 'Pizza not found');

  // Upload new image to Cloudinary if provided
  if (req.file?.path) {
    const imageUrl = await uploadOnCloudinary(req.file.path);
    updatedData.image = imageUrl;
  }

  // Assign updated fields (including new image if uploaded)
  Object.assign(pizza, updatedData);
  await pizza.save();

  res.status(200).json({
    success: true,
    pizza,
  });
});

export const deletePizza = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const pizza = await Pizza.findById(id);
  if(!pizza) throw new ApiError(404, 'Pizza not found');

  pizza.isDeleted = true;
  pizza.isAvailable = false;

  await pizza.save();

  res.status(200).json({
    success: true,
    message: 'Pizza deleted successfully',
  });
});