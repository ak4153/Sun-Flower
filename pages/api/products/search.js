import nc from 'next-connect';
import Product from '../../../models/product';
import db from '../../../utils/db';

const handler = nc();
//search for product by name
handler.post(async (req, res) => {
  console.log(req.query.query);
  await db.connect();
  const productsByName = await Product.find({ name: req.query.query });

  if (productsByName.length > 0) {
    await db.disconnect();
    return res.status(202).send(productsByName);
  } else {
    console.log('else');
    await db.disconnect();
    return res.status(404).send({ message: 'no results' });
  }
});

export default handler;
