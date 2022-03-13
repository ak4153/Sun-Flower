import nc from 'next-connect';
import Product from '../../../models/product';
import Review from '../../../models/review';
import db from '../../../utils/db';
import { isAuth } from '../../../utils/auth';
const handler = nc();

// handler.get(async (req, res) => {
//   await db.connect();
//   const reviews = await Review.find({ productId: req.query.id });

//   await db.disconnect();
//   res.status(202).send(reviews);
// });

handler.use(isAuth);

handler.post(async (req, res) => {
  const {
    exisitingReview,
    nameOfReviewer,
    review,
    stars,
    productId,
    emailOfReviewer,
  } = req.body;
  try {
    await db.connect();

    if (exisitingReview) {
      const foundReview = await Review.findById(exisitingReview);
      foundReview.review = review;
      foundReview.stars = stars;
      await foundReview.save();
      return res.status(202).send(foundReview);
    }

    const newReview = new Review({
      nameOfReviewer: nameOfReviewer,
      review: review,
      stars: stars,
      productId: productId,
      emailOfReviewer: emailOfReviewer,
    });
    await newReview.save();
    await db.disconnect();
    res.status(202).send(newReview);
  } catch (error) {
    res.status(404).send({ message: "couldn't create/update review" });
  }
});

handler.delete(async (req, res) => {
  await db.connect();
  const reviewToDelete = await Review.findByIdAndDelete(req.body.reviewId);
  await db.disconnect();
  res.status(202).send(reviewToDelete);
});
export default handler;
