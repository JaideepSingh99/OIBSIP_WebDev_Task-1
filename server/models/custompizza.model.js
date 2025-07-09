import mongoose from 'mongoose';

const customPizzaSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    minLength: [3, 'Name must be at least 3 characters'],
    maxlength: [50, 'Name must be at most 50 characters'],
  },
  base: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ingredient',
    required: [true, 'Pizza base is required'],
  },
  size: {
    type: String,
    enum: ['small', 'medium', 'large'],
    required: [true, 'Pizza size is required'],
  },
  sauce: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ingredient',
    required: [true, 'Pizza sauce is required'],
  },
  cheese: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ingredient',
    required: [true, 'Cheese is required'],
  },
  vegetables: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ingredient',
    }
  ],
  meats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ingredient',
    }
  ],
  quantity: {
    type: Number,
    default: 1,
    min: [1, 'Quantity cannot be less than 1']
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price must be calculated and saved'],
  },
  isOrdered: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

const CustomPizza = mongoose.model('CustomPizza', customPizzaSchema);

export default CustomPizza;