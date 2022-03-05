import jwt from 'jsonwebtoken';
/**
 * using jsonwebtoken
 *returns a token containing all user information
 *   _id:
 *   isAdmin:
 *  email:
 *  name:
 *  token:
 * @param {Object} user from mongodb
 * @returns {Object} token - from jwt
 */
const signToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      isAdmin: user.isAdmin,
      email: user.email,
      password: user.password,
      name: user.name,
    },
    process.env.JWT_SECRET || 'secret',
    {
      expiresIn: '30d',
    }
  );
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * middleware for checking if auth token is supplied
 * returns decoded data inside req.use
 */
const isAuthAdmin = async (req, res, next) => {
  //req.headers is supplied by placeOder post request
  const { authorization } = req.headers;

  if (authorization) {
    //Bearer xxxxxxx
    //1234567xxxxxx
    const token = authorization.slice(7, req.headers.authorization.length);
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedData) => {
      if (err) {
        res.status(401).send({ message: 'token is not valid' });
      } else if (decodedData.isAdmin) {
        req.user = decodedData;
        //carries on the request forward to the next middleware
        next();
      } else {
        res.status(403).send({ message: 'Admin privileges required' });
      }
    });
  } else {
    res.status(401).send({ message: 'admin token is not supplied' });
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * middleware for checking if auth token is supplied
 * returns decoded data inside req.use if user ==admin
 */
const isAuth = async (req, res, next) => {
  //req.headers is supplied by placeOder post request

  const { authorization } = req.headers;

  if (authorization) {
    //Bearer xxxxxxx
    //1234567xxxxxx
    const token = authorization.slice(7, req.headers.authorization.length);
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedData) => {
      if (err) {
        res.status(401).send({ message: 'token is not valid' });
      } else {
        req.user = decodedData;
        //carries on the request forward to the next middleware
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'user token is not supplied' });
  }
};
export { signToken, isAuth, isAuthAdmin };
