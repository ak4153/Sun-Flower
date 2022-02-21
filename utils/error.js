import db from './db';

const getError = (err) =>
  err.response && err.response.data && err.response.data.message
    ? err.response.data.message
    : err.message;
/**
 *
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * express-like error handler for failed requests
 */
const onError = async (err, req, res, next) => {
  await db.disconnect();
  res.status(500).send({ message: err.toString() });
};
export { getError, onError };
