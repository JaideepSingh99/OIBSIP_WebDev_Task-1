import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ingredient name is required'],
    trim: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ['base', 'sauce', 'cheese', 'vegetable', 'meat'],
    required: [true, 'Ingredient type is required'],
  },
  price: {
    type: Number,
    validate: {
      validator: function (value) {
        return this.type !== 'base' ? value !== undefined : true;
      },
      message: 'Price is required for sauce, cheese, vegetable and meat ingredients'
    },
    min: [0, 'Price cannot be negative'],
  },
  sizePrices: {
    small: {
      type: Number,
      validate: {
        validator: function (value) {
          return this.type === 'base' ? value !== undefined : true;
        }
      },
      min: [0, 'Price cannot be negative'],
    },
    medium: {
      type: Number,
      validate: {
        validator: function (value) {
          return this.type === 'base' ? value !== undefined : true;
        }
      },
      min: [0, 'Price cannot be negative'],
    },
    large: {
      type: Number,
      validate: {
        validator: function (value) {
          return this.type === 'base' ? value !== undefined : true;
        }
      },
      min: [0, 'Price cannot be negative'],
    },
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative'],
  },
  threshold: {
    type: Number,
    default: 20,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  }
}, {timestamps: true});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

export default Ingredient;