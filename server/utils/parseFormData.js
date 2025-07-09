import {ApiError} from "../middleware/error.middleware.js";

const parseFormData = (req, res, next) => {
  try {
    if(req.body.ingredients) {
      req.body.ingredients = JSON.parse(req.body.ingredients);
    }
    if(req.body.sizePrices) {
      req.body.sizePrices = JSON.parse(req.body.sizePrices);
    }
  } catch (error) {
    return next(new ApiError(400, 'Invalid JSON format'));
  }
  next();
};

export default parseFormData;