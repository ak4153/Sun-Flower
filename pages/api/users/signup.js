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
  const name = req.body.name;
  console.log(email, password, name);
  if (email && password && name) {
    //should you use salt for this?
    try {
      await db.connect();

      const user = await User.create({
        email: email,
        name: name,
        password: bcrypt.hashSync(password),
        isAdmit: false,
      });

      await db.disconnect();

      const auth = signToken(user);
      res.status(202).send({
        _id: user._id,
        isAdmin: user.isAdmin,
        email: user.email,
        name: user.name,
        token: auth,
      });
    } catch (err) {
      await db.disconnect();
      res.status(418).send({ message: 'Email already exist' });
    }
  } else {
    res.status(418).send({ message: 'Email, Password or Name are incorrect' });
  }
});
export default handler;
