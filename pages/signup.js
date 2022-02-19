import {
  Button,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab/';
import React, { useContext, useState } from 'react';
import Layout from '../components/Layout';
import dynamicSSR from '../utils/dynamicFunction';
import NextLink from 'next/link';
import useStyles from '../utils/styles';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Store } from '../utils/Store';
import { Controller, useForm } from 'react-hook-form';

function SignupScreen() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = useForm();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [name, setName] = useState();
  const { dispatch } = useContext(Store);
  const classes = useStyles();
  const router = useRouter();
  const [alert, setAlert] = useState('');
  const [confirmPassword, setConfirmPassword] = useState();
  const onSubmit = ({ email, name, password, confirmPassword }) => {
    if (confirmPassword === password) {
      axios
        .post('/api/users/signup', {
          email: email,
          password: password,
          name: name,
        })
        .then(function (response) {
          console.log(response);
          if (response.status === 202) {
            dispatch({ type: 'SET_USER', payload: response.data });
            router.push('/');
          }
        })
        .catch(function (error) {
          //error message for invalid signup
          console.log(error.response.data);
          setAlert(error.response.data.message);
        });
    } else {
      setAlert("Passwords don't match");
    }
  };
  return (
    <Layout title="Signup">
      <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
        <Typography component="h1" variant="h1">
          Signup
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
              name="name"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 2,
              }}
              render={({ field }) => (
                <TextField
                  id="name__signup"
                  label="Name"
                  fullWidth
                  variant="outlined"
                  type="text"
                  inputProps={{ type: 'name' }}
                  error={Boolean(errors.name)}
                  helperText={
                    errors.name
                      ? errors.name.type === 'minLength'
                        ? "Name isn't valid, minimum of 2 characters"
                        : 'Name is required'
                      : ''
                  }
                  {...field}
                />
              )}
            />
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
            <Controller
              name="confirmPassword"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 3,
              }}
              render={({ field }) => (
                <TextField
                  {...register('confirmPassword', { required: true })}
                  id="confirmPassword"
                  label="confirm password"
                  fullWidth
                  variant="outlined"
                  type="password"
                  inputProps={{ type: 'password' }}
                  error={Boolean(errors.confirmPassword)}
                  helperText={
                    errors.confirmPassword
                      ? errors.confirmPassword.type === 'minLength'
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
              Signup
            </Button>
          </ListItem>
          <ListItem>
            <Typography>Have an account? &nbsp; </Typography>

            <NextLink href={'/login'}>
              <Link>Login</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}

export default dynamicSSR(SignupScreen);
