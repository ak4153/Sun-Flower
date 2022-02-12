import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    price: { type: Number, required: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    image: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    countInStock: { type: Number, required: true, default: 0 },
    category: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
//if its already exists in the database dont create a new one
export const Product =
  mongoose.models.Product || mongoose.models('Product', productSchema);
