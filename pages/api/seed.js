import nc from 'next-connect';
import { Product } from '../../models/product';
import { User } from '../../models/user';
import data from '../../utils/data';
import userData from '../../utils/userData';
import db from '../../utils/db';
const handler = nc();

handler.get(async (req, res) => {
  db.connect();
  await User.deleteMany();
  await User.insertMany(userData.users);
  await Product.deleteMany();
  await Product.insertMany(data.products);
  await db.disconnect();
  res.send('seeded');
});
export default handler;
