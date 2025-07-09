import Ingredient from "../models/ingredient.model.js";
import Pizza from "../models/pizza.model.js";

export const updatePizzaAvailability = async () => {
  const ingredients = await Ingredient.find({ isAvailable: true, isDeleted: false });
  const ingredientMap = new Map(ingredients.map(ing => [ing._id.toString(), ing]));

  const pizzas = await Pizza.find({ isDeleted: false });

  for(const pizza of pizzas) {
    const usedIngredients = pizza.ingredients;
    let allInStock = true;

    for(const id of usedIngredients) {
      const ing = ingredientMap.get(id.toString());
      if(!ing || ing.stock <= 0) {
        allInStock = false;
        break;
      }
    }

    if (pizza.isAvailable !== allInStock) {
      pizza.isAvailable = allInStock;
      await pizza.save();
    }

  }
};