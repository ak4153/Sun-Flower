import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    nameOfReviewer: { type: String, required: true },
    user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    review: { type: String, required: true },
    stars: { type: Number, required: true, min: 1, max: 5 },
  },
  {
    timestamps: true,
  }
);

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
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);
//if its already exists in the database dont create a new one
const Product =
  mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
