import React from 'react';
import {
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  Link,
} from '@material-ui/core';
import Layout from '../components/Layout';
import useStyles from '../utils/styles';
import NextLink from 'next/link';

import dynamicSSR from '../utils/dynamicFunction';

const LoginScreen = () => {
  const classes = useStyles();
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('ss');
  };
  return (
    <Layout title="Login">
      <form onSubmit={handleSubmit} className={classes.form}>
        <Typography component="h1" variant="h1">
          Login
        </Typography>
        <List>
          <ListItem>
            <TextField
              id="email"
              label="Email"
              fullWidth
              variant="outlined"
              type="email"
              required
            />
          </ListItem>
          <ListItem>
            <TextField
              id="password"
              label="Password"
              variant="outlined"
              type="password"
              required
              fullWidth
            />
          </ListItem>
          <ListItem>
            <Button
              fullWidth
              align="center"
              type="submit"
              variant="contained"
              color="primary"
            >
              Login
            </Button>
          </ListItem>
          <ListItem>
            <Typography>Don&#39;t have an account?{'  '} </Typography>

            <NextLink href={'/signup'}>
              <Link>{'  '}Sign Up</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
};

export default dynamicSSR(LoginScreen);
