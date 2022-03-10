import nc from 'next-connect';
import Product from '../../../../models/product';
import Review from '../../../../models/review';
import db from '../../../../utils/db';
import { isAuth } from '../../../../utils/auth';
const handler = nc();

handler.get(async (req, res) => {
  console.log(req.query.id);
  await db.connect();
  const reviews = await Review.find({ productId: req.query.id });
  await db.disconnect();
  res.status(202).send(reviews);
});
export default handler;
