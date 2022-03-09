import nc from 'next-connect';
import Order from '../../../../models/order';
import { isAuthAdmin } from '../../../../utils/auth';
import db from '../../../../utils/db';
import { onError } from '../../../../utils/error';
import User from '../../../../models/user';
import bcrypt from 'bcryptjs';
//middleware incase of an error
const handler = nc({ onError });
handler.use(isAuthAdmin);

handler.put(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.query.id);
  if (user) {
    user.password = bcrypt.hashSync('123');
    await user.save();
    await db.disconnect();
    return res.status(202).send({ message: 'succefully reseted password' });
  } else {
    await db.disconnect();
    return res.status(500).send({ message: 'could not fetch users' });
  }
});

export default handler;
