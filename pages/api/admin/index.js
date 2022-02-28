import nc from 'next-connect';
import Order from '../../../models/order';
import { isAuthAdmin } from '../../../utils/auth';
import db from '../../../utils/db';
import { onError } from '../../../utils/error';
import User from '../../../models/user';
import Product from '../../../models/product';
//middleware incase of an error
const handler = nc({ onError });
handler.use(isAuthAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const orders = await Order.find();
  const users = await User.countDocuments();
  const products = await Product.countDocuments();

  const orderPriceGroup = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalPrice: { $sum: '$totalPrice' },
      },
    },
  ]);
  await db.disconnect();

  const totalPrice =
    orderPriceGroup.length > 0 ? orderPriceGroup[0].totalPrice : 0;

  const salesData = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        totalPrice: { $sum: '$totalPrice' },
      },
    },
  ]);

  res.status(201).send({
    totalPrice: totalPrice,
    orders,
    users: users,
    products: products,
    salesData: salesData,
  });
});

export default handler;
