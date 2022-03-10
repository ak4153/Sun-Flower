import mongoose from 'mongoose';
const reviewSchema = new mongoose.Schema(
  {
    nameOfReviewer: { type: String, required: true },
    emailOfReviewer: { type: String, required: true, unique: true },
    review: { type: String, required: true },
    stars: { type: Number, required: true, min: 1, max: 5 },
    productId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
export default Review;
