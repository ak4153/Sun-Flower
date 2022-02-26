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
import { Controller, useForm } from 'react-hook-form';

const LoginScreen = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = useForm();
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
  });

  const onSubmit = (data) => {
    // e.preventDefault();
    // const email = e.target[0].value;
    // const password = e.target[2].value;
    const password = data.password;
    const email = data.email;
    console.log(password, email);
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
        console.log(error.response.data);
        setAlert(error.response.data.message);
      });
  };

  return (
    <Layout title="Login">
      <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
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
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
              }}
              render={({ field }) => (
                <TextField
                  {...register('email', { required: true })}
                  id="email"
                  label="Email"
                  fullWidth
                  variant="outlined"
                  type="email"
                  inputProps={{ type: 'email' }}
                  error={Boolean(errors.email)}
                  helperText={
                    errors.email
                      ? errors.email.type === 'pattern'
                        ? "Email isn't valid"
                        : 'Email is required'
                      : ''
                  }
                  {...field}
                />
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 3,
              }}
              render={({ field }) => (
                <TextField
                  {...register('password', { required: true })}
                  id="password"
                  label="password"
                  fullWidth
                  variant="outlined"
                  type="password"
                  inputProps={{ type: 'password' }}
                  error={Boolean(errors.password)}
                  helperText={
                    errors.password
                      ? errors.password.type === 'minLength'
                        ? "password isn't valid, minimum of 3 characters"
                        : 'password is required'
                      : ''
                  }
                  {...field}
                />
              )}
            ></Controller>
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
