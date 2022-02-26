import nc from 'next-connect';
import Order from '../../../../models/Order';
import { isAuth } from '../../../../utils/auth';
import db from '../../../../utils/db';
import { onError } from '../../../../utils/error';

//middleware incase of an error
const handler = nc({ onError });
handler.use(isAuth);
//[id] file name this one acts as /api/products/:productId
handler.get(async (req, res) => {
  const order = req.query.id;
  await db.connect();
  const foundOrder = await Order.findById(order);
  await db.disconnect();
  res.status(201).send(foundOrder);
});

export default handler;
