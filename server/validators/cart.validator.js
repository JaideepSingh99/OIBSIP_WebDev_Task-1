import * as yup from 'yup';

export const addToCartSchema = yup.object().shape({
  itemType: yup
    .string()
    .oneOf(['Pizza', 'CustomPizza'], 'Invalid item type')
    .required('Item type is required'),

  pizza: yup
    .string()
    .required('Pizza ID is required'),

  size: yup
    .string()
    .when('itemType', ([itemType], schema) => {
      if (itemType === 'Pizza') {
        return schema
          .oneOf(['small', 'medium', 'large'], 'Invalid size')
          .required('Size is required');
      }
      return schema.notRequired();
    }),

  quantity: yup
    .number()
    .min(1, 'Quantity must be at least 1')
    .default(1),
});

export const updateCartItemSchema = yup.object({
  itemIndex: yup
    .number()
    .min(0, 'Invalid item index')
    .required('Item index is required'),
  quantity: yup
    .number()
    .min(1, 'Quantity must be at least 1')
    .optional(),
  size: yup
    .string()
    .oneOf(['small', 'medium', 'large'], 'Invalid size')
    .optional(),
});