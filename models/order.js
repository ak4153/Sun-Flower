import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    shippingData: {
      fullName: { type: String, required: true },
      country: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      address: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true },
    itemsPrice: { type: Number, required: true },
    tax: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, required: true, default: false },
    isDelivered: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    deliveredAt: { type: Date },
    paymentResult: {
      id: { type: String, unique: true },
      status: { type: String },
      email_address: { type: String },
    },
  },
  {
    timestamps: true,
  }
);
//if its already exists in the database dont create a new one
export const Order =
  mongoose.models.Order || mongoose.model('Order', orderSchema);
