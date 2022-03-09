import nc from 'next-connect';
import Order from '../../../../models/order';
import { isAuthAdmin } from '../../../../utils/auth';
import db from '../../../../utils/db';
import { onError } from '../../../../utils/error';
import User from '../../../../models/user';
import Product from '../../../../models/product';
//middleware incase of an error
const handler = nc({ onError });
handler.use(isAuthAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const allUsers = await User.find();
  if (allUsers) {
    await db.disconnect();
    return res.status(202).send(allUsers);
  } else {
    await db.disconnect();
    return res.status(500).send({ message: 'could not fetch users' });
  }
});

export default handler;
