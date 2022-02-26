import nc from 'next-connect';
import { isAuth } from '../../../../utils/auth';
import db from '../../../../utils/db';
import { onError } from '../../../../utils/error';
import Order from '../../../../models/Order';

//middleware incase of an error
const handler = nc({ onError });
handler.use(isAuth);

//[id] file name this one acts as /api/products/:productId
handler.get(async (req, res) => {
  console.log(req.user._id);
  db.connect();
  const orders = await Order.find({ user: req.user._id });
  db.disconnect();
  if (orders) {
    return res.status(202).send(orders);
  } else {
    return res.status(403).send({ message: 'Error fetching orders' });
  }
});

export default handler;
