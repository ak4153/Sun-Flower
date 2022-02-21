import nc from 'next-connect';

import { isAuth } from '../../../utils/auth';

//returns paypal client id
const handler = nc();
handler.use(isAuth);
handler.get(async (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

export default handler;
