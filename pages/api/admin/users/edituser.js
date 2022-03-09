import nc from 'next-connect';
import { isAuthAdmin } from '../../../../utils/auth';
import db from '../../../../utils/db';
import { onError } from '../../../../utils/error';
import User from '../../../../models/user';
import bcrypt from 'bcryptjs';
//middleware incase of an error
const handler = nc({ onError });
handler.use(isAuthAdmin);

handler.put(async (req, res) => {
  const { email, isAdmin, name, _id } = req.body;
  console.log(req.body);
  await db.connect();
  const user = await User.findById(_id);
  if (user) {
    user.email = email;
    user.isAdmin = isAdmin;
    user.name = name;
    await user.save();
    await db.disconnect();
    return res.status(202).send({ message: 'succefully updated user' });
  } else {
    await db.disconnect();
    return res.status(404).send({ message: 'could not update user' });
  }
});

export default handler;
