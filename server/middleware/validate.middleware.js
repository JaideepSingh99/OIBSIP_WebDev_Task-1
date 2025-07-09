import {ApiError} from "./error.middleware.js";

export const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    const formatted = error.inner?.map(e => ({
      path: e.path,
      message: e.message,
    })) || [{
      path: 'body',
      message: error.message || 'Validation error',
    }];

    res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: formatted,
    });
  }
};
