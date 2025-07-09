import { Router } from 'express';
import {protect} from "../middleware/auth.middleware.js";
import {getAvailableIngredients} from "../controller/ingredient.controller.js";

const ingredientRouter = Router();

ingredientRouter.get('/', protect, getAvailableIngredients);

export default ingredientRouter;