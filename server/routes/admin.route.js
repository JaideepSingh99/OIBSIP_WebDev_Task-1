import { Router } from 'express';
import {adminOnly, protect} from "../middleware/auth.middleware.js";
import {getAllOrders, updateOrderStatus} from "../controller/order.controller.js";
import {
  createIngredient,
  deleteIngredient,
  getAllIngredients,
  updateIngredient
} from "../controller/ingredient.controller.js";
import {validate} from "../middleware/validate.middleware.js";
import {createIngredientSchema, updateIngredientSchema} from "../validators/ingredient.validator.js";
import {createPizza, deletePizza, getAllPizzasAdmin, updatePizza} from "../controller/pizza.controller.js";
import {createPizzaSchema, updatePizzaSchema} from "../validators/pizza.validator.js";
import {upload} from "../middleware/upload.middleware.js";
import parseFormData from "../utils/parseFormData.js";
import {getAdminDashboard, getAdminStats} from "../controller/dashboard.controller.js";

const adminRouter = Router();

adminRouter.use(protect, adminOnly);

// Order Status Route
adminRouter.patch('/orders/:orderId/status', updateOrderStatus);
adminRouter.get('/orders', getAllOrders);
adminRouter.get('/dashboard', getAdminDashboard);
adminRouter.get('/dashboard-stats', getAdminStats);

// Ingredient CRUD Route
adminRouter.get('/ingredients', getAllIngredients);
adminRouter.post('/ingredients', validate(createIngredientSchema), createIngredient);
adminRouter.put('/ingredients/:id', validate(updateIngredientSchema), updateIngredient);
adminRouter.delete('/ingredients/:id', deleteIngredient);

// Pizza CRUD Route
adminRouter.get('/pizzas', getAllPizzasAdmin);
adminRouter.post('/pizzas', upload.single('image'), parseFormData, validate(createPizzaSchema), createPizza);
adminRouter.put('/pizzas/:id', upload.single('image'), parseFormData, validate(updatePizzaSchema), updatePizza);
adminRouter.delete('/pizzas/:id', deletePizza);

export default adminRouter;