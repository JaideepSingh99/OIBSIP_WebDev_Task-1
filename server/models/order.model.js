import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
          return this.itemType === 'Pizza';
        }
      },
      quantity: {
        type: Number,
        default: 1,
        min: [1, 'Quantity cannot be less than 1']
      },
      price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative']
      }
    }
  ],
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total amount cannot be negative']
  },
  deliveryAddress: {
    street: {type: String, required: true},
    city: {type: String, required: true},
    state: {type: String, required: true},
    pincode: {type: String, required: true},
    country: {type: String, required: true},
    phone: {type: String, required: true},
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'online'],
    default: 'online',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'received', 'inKitchen', 'outForDelivery' , 'delivered', 'cancelled'],
    default: 'pending',
  },
  isCancelled: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;