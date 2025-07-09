import * as yup from 'yup';

export const registerSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(3)
    .max(50),
  email: yup
    .string()
    .required('Email is required')
    .email('Email is invalid'),
  password: yup
    .string()
    .required('Password is required')
    .min(6)
    .max(50),
  phone: yup
    .string()
    .required('Phone is required')
    .matches(/^\d{10}$/, 'Phone must be 10 digits'),
  address: yup.object({
    street: yup.string().required('Street is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    pincode: yup.string().required('Pincode is required').matches(/^\d{6}$/, 'Pincode must be 6 digits'),
    country: yup.string().required('Country is required')
  }).required('Address is required')
});

export const loginSchema = yup.object({
  email: yup
    .string()
    .email('Email is invalid')
    .required('Email is required'),
  password: yup
    .string()
    .required('Password is required'),
});

export const resendVerificationSchema = yup.object({
  email: yup.string().email('Email is invalid').required('Email is required')
});