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

export { signToken };
