import nc from 'next-connect';
import Product from '../../../../models/product';
import db from '../../../../utils/db';
import { isAuthAdmin } from '../../../../utils/auth';
import { onError } from '../../../../utils/error';
const handler = nc({ onError });
handler.use(isAuthAdmin);
handler.delete(async (req, res) => {
  const { id } = req.query;
  console.log(id);
  await db.connect();
  const product = await Product.findByIdAndDelete(id);
  if (product) {
    await db.disconnect();
    return res.status(202).send({ message: 'Product delete successfully' });
  } else {
    await db.disconnect();
    return res.status(404).send({ message: 'could not delete product' });
  }
});

export default handler;
/*

{
  productId: '621a011a490428804b709e1d',
  name: 'Uni Shirt',
  brand: 'UniCorp',
  description: 'A token of power',
  countInStock: 16,
  price: 55,
  category: 'Shirts',
  image: '/images/shirt1.jpg',
  slug: 'uni-shirt'
}

*/
