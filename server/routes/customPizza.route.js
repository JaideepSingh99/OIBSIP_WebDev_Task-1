import { Router } from 'express';
import {protect} from "../middleware/auth.middleware.js";
import {validate} from "../middleware/validate.middleware.js";
import {
  createCustomPizza,
  deleteCustomPizza,
  getCustomPizzas,
  getMyCustomPizza, updateCustomPizza
} from "../controller/customPizza.controller.js";
import {createCustomPizzaSchema} from "../validators/customPizza.validator.js";

const customPizzaRouter = Router();

customPizzaRouter.use(protect);

customPizzaRouter.get('/', getCustomPizzas);
customPizzaRouter.post('/', validate(createCustomPizzaSchema), createCustomPizza);
customPizzaRouter.get('/my', getMyCustomPizza);
customPizzaRouter.put('/:id', updateCustomPizza);
customPizzaRouter.delete('/:id', deleteCustomPizza);

export default customPizzaRouter;