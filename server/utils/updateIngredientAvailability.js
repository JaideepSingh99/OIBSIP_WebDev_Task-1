import Ingredient from "../models/ingredient.model.js";

export const updateIngredientAvailability = async () => {
  const ingredients = await Ingredient.find({ isDeleted: false });

  for (const ing of ingredients) {
    if (ing.stock <= 0 && ing.isAvailable) {
      ing.isAvailable = false;
      await ing.save();
    } else if (ing.stock > 0 && !ing.isAvailable) {
      ing.isAvailable = true;
      await ing.save();
    }
  }
};