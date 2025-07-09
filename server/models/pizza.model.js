import mongoose from 'mongoose';

const pizzaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pizza name is required'],
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
  },
  ingredients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ingredient',
      required: true
    },
  ],
  sizePrices: {
    small: {
      type: Number,
      required: [true, 'Price is required for small pizza'],
    },
    medium: {
      type: Number,
      required: [true, 'Price is required for medium pizza'],
    },
    large: {
      type: Number,
      required: [true, 'Price is required for large pizza'],
    },
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, {timestamps: true});

const Pizza = mongoose.model('Pizza', pizzaSchema);

export default Pizza;