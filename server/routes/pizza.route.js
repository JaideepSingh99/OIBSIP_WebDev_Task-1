import { Router } from 'express';
import {getAllPizzas} from "../controller/pizza.controller.js";

const pizzaRouter = Router();

pizzaRouter.get('/' , getAllPizzas);

export default pizzaRouter;