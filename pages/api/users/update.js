import nc from 'next-connect';
import { User } from '../../../models/user';
import db from '../../../utils/db';
import bcrypt from 'bcryptjs';
import { isAuth, signToken } from '../../../utils/auth';

const handler = nc();
handler.use(isAuth);

handler.put(async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const id = req.body._id;
  console.log(email, password, name);

  if (email && password && name) {
    //should you use salt for this?
    //nope you have a jwt token
    try {
      await db.connect();
      const foundUser = await User.findById(id);
      foundUser.email = email;
      foundUser.name = name;
      foundUser.password = bcrypt.hashSync(password);
      await foundUser.save();
      await db.disconnect();

      const auth = signToken(foundUser);

      return res.status(202).send({
        _id: foundUser._id,
        isAdmin: foundUser.isAdmin,
        email: foundUser.email,
        name: foundUser.name,
        token: auth,
      });
    } catch (err) {
      await db.disconnect();
      res.status(418).send({ message: err.message });
    }
  } else {
    res.status(418).send({ message: 'Email, Password or Name are incorrect' });
  }
});
export default handler;
