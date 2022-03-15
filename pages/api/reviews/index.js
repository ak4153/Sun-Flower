import nc from 'next-connect';
import Product from '../../../models/product';
// import Review from '../../../models/review';
import db from '../../../utils/db';
import { isAuth } from '../../../utils/auth';
import mongoose from 'mongoose';
const handler = nc();

// handler.get(async (req, res) => {
//   await db.connect();
//   const reviews = await Review.find({ productId: req.query.id });

//   await db.disconnect();
//   res.status(202).send(reviews);
// });

handler.use(isAuth);

handler.post(async (req, res) => {
  const { exisitingReview, nameOfReviewer, review, stars, productId, user } =
    req.body;
  try {
    await db.connect();
    //exisitingReview = review_id

    if (exisitingReview.productId) {
      const foundReview = await Product.updateOne(
        {
          //drilling down to the path of the Product>reviews>review>_id
          _id: exisitingReview.productId,
          //search query thru reviews
          'reviews._id': exisitingReview.reviewId,
        },
        {
          $set: {
            //update query
            'reviews.$.review': review,
            'reviews.$.stars': Number(stars),
          },
        }
      );

      // return res.status(202).send(foundReview);
    } else {
      const product = await Product.findById(productId);
      product.reviews.push({
        nameOfReviewer: nameOfReviewer,
        review: review,
        stars: Number(stars),
        user: mongoose.Types.ObjectId(user),
      });
      await product.save();
    }
    const product = await Product.findById(productId);

    product.numReviews = Number(product.reviews.length);
    product.rating = Math.ceil(
      product.reviews.reduce((acc, curr) => acc + curr.stars, 0) /
        product.numReviews
    );

    await product.save();
    await db.disconnect();
    res.status(202).send(product);
  } catch (error) {
    await db.disconnect();

    res.status(404).send({ message: "couldn't create/update review" });
  }
});

handler.delete(async (req, res) => {
  await db.connect();

  const { review_id, product_id } = req.body;
  console.log(review_id, product_id);
  const reviewToDelete = await Product.updateOne(
    {
      _id: product_id,
    },
    //drilling again for fishing out the review
    {
      $pull: { reviews: { _id: review_id } },
    }
  );
  await db.disconnect();
  res.status(202).send(reviewToDelete);
});
export default handler;
