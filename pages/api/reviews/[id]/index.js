import nc from 'next-connect';

import db from '../../../../utils/db';
import Product from '../../../../models/product';

//reviews fetch
const handler = nc();
//finds all relevant reviews to a product
handler.get(async (req, res) => {
  await db.connect();

  const product = await Product.findById(req.query.id);
  await db.disconnect();
  if (product.reviews) {
    res.status(202).send(product.reviews);
  } else {
    res.status(202).send([]);
  }
});
export default handler;
