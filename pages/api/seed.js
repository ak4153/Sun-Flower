import nc from 'next-connect';
import { Product } from '../../models/product';
import data from '../../utils/data';
import db from '../../utils/db';
const handler = nc();
handler.get(async (req, res) => {
  db.connect();
  await Product.deleteMany();
  await Product.insertMany(data.products);
  await db.disconnect();
  res.send('seeded');
});
export default handler;
