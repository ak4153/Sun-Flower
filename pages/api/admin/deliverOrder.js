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

handler.put(async (req, res) => {
  console.log('ff');
  await db.connect();
  const orderToBeDelivered = await Order.findById(req.body.orderId);

  if (orderToBeDelivered) {
    orderToBeDelivered.isDelivered = true;
    orderToBeDelivered.deliveredAt = Date.now();
    await orderToBeDelivered.save();
    await db.disconnect();
    return res.status(202).send({ message: 'order successfuly delivered' });
  } else {
    await db.disconnect();
    return res.status(500).send({ message: 'could not deliver order' });
  }
});

export default handler;
