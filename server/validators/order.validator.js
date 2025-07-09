import * as yup from 'yup';

export const placeOrderSchema = yup.object({
  items: yup
    .array()
    .of(
      yup.object({
        itemType: yup
          .string()
          .oneOf(['Pizza', 'CustomPizza'], 'Invalid item type')
          .required('Item type is required'),

        pizza: yup
          .string()
          .required('Pizza ID is required'),

        size: yup
          .string()
          .when('itemType', {
            is: 'Pizza',
            then: (schema) =>
              schema
                .oneOf(['small', 'medium', 'large'], 'Invalid size')
                .required('Size is required for predefined pizzas'),
            otherwise: (schema) => schema.notRequired(),
          }),

        quantity: yup
          .number()
          .min(1, 'Quantity must be at least 1')
          .default(1),
      })
    )
    .required('Items are required'),

  deliveryAddress: yup.object({
    street: yup.string().required('Street is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    pincode: yup.string().required('Pincode is required'),
    country: yup.string().required('Country is required'),
    phone: yup.string().required('Phone is required'),
  }),

  paymentMethod: yup
    .string()
    .oneOf(['online', 'cash'], 'Invalid payment method')
    .required('Payment method is required'),
});
