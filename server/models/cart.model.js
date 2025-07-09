import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  items: [
    {
      itemType: {
        type: String,
        enum: ['Pizza', 'CustomPizza'],
        required: true
      },
      pizza: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'items.itemType',
        required: true
      },
      size: {
        type: String,
        enum: ['small', 'medium', 'large'],
        required: function () {
          return this.itemType === 'predefined';
        }
      },
      quantity: {
        type: Number,
        default: 1,
        min: [1, 'Quantity must be at least 1']
      },
      price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative']
      }
    }
  ],
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Total price cannot be negative']
  }
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;