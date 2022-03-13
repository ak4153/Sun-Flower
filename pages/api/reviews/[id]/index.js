import nc from 'next-connect';

import Review from '../../../../models/review';
import db from '../../../../utils/db';

const handler = nc();
//finds all relevant reviews to a product
handler.get(async (req, res) => {
  await db.connect();
  const reviews = await Review.find({ productId: req.query.id });
  await db.disconnect();
  res.status(202).send(reviews);
});
export default handler;
