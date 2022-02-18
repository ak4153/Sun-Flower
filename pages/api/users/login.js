import nc from 'next-connect';
import { User } from '../../../models/user';
import cors from 'cors';
import db from '../../../utils/db';
import bcrypt from 'bcryptjs';
import { signToken } from '../../../utils/auth';
const handler = nc();

handler.post(async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  await db.connect();
  const user = await User.findOne({ email: email });
  await db.disconnect();
  //check if password match and create a token
  const passwordMatches = bcrypt.compareSync(password, user.password);
  if (user && passwordMatches) {
    const auth = signToken(user);
    res.status(201).send({
      _id: user._id,
      isAdmin: user.isAdmin,
      email: user.email,
      name: user.name,
      token: auth,
    });
  } else {
    res.status(401).send({ message: 'Invalid Email or Password' });
  }
});

export default handler;
