import nc from 'next-connect';
import { Order } from '../../../models/Order';
import { isAuth } from '../../../utils/auth';
import db from '../../../utils/db';
import { onError } from '../../../utils/error';

//middleware incase of an error
const handler = nc({ onError });
handler.use(isAuth);
//[id] file name this one acts as /api/products/:productId
handler.post(async (req, res) => {
  const newOrder = new Order({ ...req.body, user: req.user._id });
  await db.connect();
  const order = await newOrder.save();
  await db.disconnect();
  res.status(200).send(order);
});

handler.get(async (req, res) => {
  console.log(req.params);
  const order = req.params.orderId;
  await db.connect();
  const foundOrder = await Order.findById(order);
  await db.disconnect();
  res.status(201).send(foundOrder);
});

export default handler;
