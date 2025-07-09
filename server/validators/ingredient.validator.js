import * as yup from 'yup';

export const createIngredientSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(3)
    .max(50),
  type: yup
    .string()
    .required('Type is required')
    .oneOf(['base', 'sauce', 'cheese', 'vegetable', 'meat']),
  price: yup
    .number()
    .required('Price is required')
    .min(0),
  sizePrices: yup.object().shape({
    small: yup
      .number()
      .min(0),
    medium: yup
      .number()
      .min(0),
    large: yup
      .number()
      .min(0)
  }).when('type', {
    is: (type) => type === 'base',
    then: (schema) => schema.required('Size prices are required'),
    otherwise: (schema) => schema.notRequired()
  }),
  stock: yup
    .number()
    .required('Stock is required')
    .min(0),
  threshold: yup
    .number()
    .min(0)
});

export const updateIngredientSchema = yup.object({
  name: yup
    .string()
    .min(3)
    .max(50),
  type: yup
    .string()
    .oneOf(['base', 'sauce', 'cheese', 'vegetable', 'meat']),
  price: yup
    .number()
    .min(0),
  sizePrices: yup.object().shape({
    small: yup
      .number()
      .min(0),
    medium: yup
      .number()
      .min(0),
    large: yup
      .number()
      .min(0)
  }).nullable(),
  stock: yup
    .number()
    .min(0),
  threshold: yup
    .number()
    .min(0),
  isAvailable: yup.boolean(),
  isDeleted: yup.boolean()
});