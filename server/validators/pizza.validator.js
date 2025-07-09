import * as yup from 'yup';

export const createPizzaSchema = yup.object({
  name: yup
    .string()
    .required('Pizza name is required')
    .min(3)
    .max(50),
  description: yup
    .string()
    .max(500),
  image: yup
    .string()
    .url()
    .optional(),
  ingredients: yup
    .array()
    .of(yup.string())
    .min(1)
    .required('At least one ingredient is required'),
  sizePrices: yup.object({
    small: yup.number().required('Small price is required').min(0),
    medium: yup.number().required('Medium price is required').min(0),
    large: yup.number().required('Large price is required').min(0)
  }),
  isAvailable: yup.boolean().optional(),
});

export const updatePizzaSchema = yup.object({
  name: yup.string().min(3).max(50),
  description: yup.string().max(500),
  image: yup.string().url(),
  ingredients: yup.array().of(yup.string().length(24)),
  sizePrices: yup.object({
    small: yup.number().min(0),
    medium: yup.number().min(0),
    large: yup.number().min(0),
  }),
  isAvailable: yup.boolean(),
});