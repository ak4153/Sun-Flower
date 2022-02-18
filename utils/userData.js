import bcrypt from 'bcryptjs';

const users = {
  users: [
    {
      email: 'test@test.com',
      password: bcrypt.hashSync('123456'),
      name: 'alex',
      isAdmin: true,
    },
    {
      email: 'test1@test.com',
      password: bcrypt.hashSync('123456'),
      name: 'alex',
      isAdmin: false,
    },
  ],
};
export default users;
