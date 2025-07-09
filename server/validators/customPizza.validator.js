import * as yup from 'yup';

export const createCustomPizzaSchema = yup.object({
  name: yup
    .string()
    .min(3)
    .max(50)
    .optional(),
  base: yup
    .string()
    .required('Base is required'),
  size: yup
    .string()
    .oneOf(['small', 'medium', 'large']).required(),
  sauce: yup
    .string()
    .required('Sauce is required'),
  cheese: yup
    .string()
    .required(),
  vegetables: yup
    .array().of(yup.string()).optional(),
  meats: yup
    .array().of(yup.string()).optional(),
  quantity: yup
    .number()
    .min(1)
    .default(1),
});