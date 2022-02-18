import React, { useContext, useEffect, useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  Link,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab/';
import Layout from '../components/Layout';
import useStyles from '../utils/styles';
import NextLink from 'next/link';
import dynamicSSR from '../utils/dynamicFunction';
import axios from 'axios';
import cookies from 'js-cookie';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';

const LoginScreen = () => {
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  const [alert, setAlert] = useState('');
  const { redirect } = router.query; //login?redirect=/shipping

  const classes = useStyles();
  const { user } = state;
  //check once if user logged in
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[2].value;

    axios
      .post('/api/users/login', {
        email: email,
        password: password,
      })
      .then(function (response) {
        if (response.status === 201) {
          dispatch({ type: 'SET_USER', payload: response.data });
          router.push(redirect || '/');
        }
      })
      .catch(function (error) {
        console.log(error.response.data.message);
        setAlert(error.response.data.message);
      });
  };

  return (
    <Layout title="Login">
      <form onSubmit={handleSubmit} className={classes.form}>
        <Typography component="h1" variant="h1">
          Login
        </Typography>
        {alert && (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {alert}
          </Alert>
        )}
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
            <Typography>Don&#39;t have an account? &nbsp; </Typography>

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
