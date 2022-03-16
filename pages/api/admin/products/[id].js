import nc from 'next-connect';
import Product from '../../../../models/product';
import db from '../../../../utils/db';
import { isAuthAdmin } from '../../../../utils/auth';
import { onError } from '../../../../utils/error';
const handler = nc({ onError });
handler.use(isAuthAdmin);
handler.put(async (req, res) => {
  const {
    productId,
    name,
    brand,
    description,
    countInStock,
    price,
    category,
    image,
    slug,
    featuredImage,
    featured,
  } = req.body;
  await db.connect();
  console.log(req.body.featured);
  const product = await Product.findById(productId);
  if (product) {
    product.price = price;
    product.name = name;
    product.brand = brand;
    product.image = image;
    product.slug = slug;
    product.description = description;
    product.category = category;
    product.countInStock = countInStock;
    product.featuredImage = featuredImage || '';
    product.isFeatured = featured;
    await product.save();
    await db.disconnect();
    return res.status(202).send({ message: 'Product updated successfully' });
  } else {
    await db.disconnect();
    return res.status(404).send({ message: 'could not update product' });
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
