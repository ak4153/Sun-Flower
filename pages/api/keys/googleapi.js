import nc from 'next-connect';

import { isAuth } from '../../../utils/auth';

//returns googleApi key
const handler = nc();
handler.use(isAuth);
handler.get(async (req, res) => {
  console.log('ss');
  res.send(process.env.GOOGLE_API_KEY || 'NOKEY');
});

export default handler;
