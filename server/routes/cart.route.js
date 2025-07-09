import { Router } from 'express';
import {protect} from "../middleware/auth.middleware.js";
import {addToCart, clearCart, getCart, removeCartItem, updateCartItem} from "../controller/cart.controller.js";
import {validate} from "../middleware/validate.middleware.js";
import {addToCartSchema, updateCartItemSchema} from "../validators/cart.validator.js";

const cartRouter = Router();

cartRouter.use(protect);

cartRouter.get('/', getCart);
cartRouter.post('/add', validate(addToCartSchema), addToCart);
cartRouter.put('/update', validate(updateCartItemSchema), updateCartItem);
cartRouter.delete('/remove/:itemIndex', removeCartItem);
cartRouter.delete('/clear', clearCart);

export default cartRouter;