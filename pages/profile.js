import {
  Button,
  Card,
  CardContent,
  Grid,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import useStyles from '../utils/styles';
import axios from 'axios';
import { Store } from '../utils/Store';
import dynamicSSR from '../utils/dynamicFunction';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Controller, useForm } from 'react-hook-form';
import { Alert, AlertTitle } from '@material-ui/lab';

function OrderHistory() {
  const classess = useStyles();
  const { state, dispatch } = useContext(Store);
  const { user } = state;
  const router = useRouter();
  const [alert, setAlert] = useState('');
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = useForm();

  const onSubmit = ({ email, name, password, confirmPassword }) => {
    if (confirmPassword === password) {
      axios
        .put(
          '/api/users/update',
          {
            email: email,
            password: password,
            name: name,
            _id: user._id,
          },
          { headers: { authorization: `Bearer ${user.token}` } }
        )
        .then((result) => {
          setAlert({ message: 'Successfuly updated', variant: 'success' });
          return dispatch({ type: 'SET_USER', payload: result.data });
        })
        .catch(function (error) {
          //error message for invalid signup
          console.log(error.response.data);
          setAlert({
            message: error.response.data.message,
            variant: 'warning',
          });
        });
    } else {
      setAlert({ message: "Passwords don't match", variant: 'warning' });
    }
  };
  useEffect(() => {
    if (!user) router.push('/login');
  });

  return (
    <Layout title="Profile">
      <form onSubmit={handleSubmit(onSubmit)}>
        {alert.message && (
          <Alert severity={alert.variant} className={classess.section}>
            <AlertTitle>Error</AlertTitle>
            {alert.message}
          </Alert>
        )}
        <Grid
          spacing={1}
          container
          className={classess.section}
          justifyContent="center"
        >
          <Grid item xs={12} md={2}>
            <Card className={classess.section}>
              <CardContent>
                <Typography>
                  <NextLink href={'/profile'}>
                    <Link>
                      <strong>Profile</strong>
                    </Link>
                  </NextLink>
                </Typography>
              </CardContent>
              <CardContent>
                <Typography>
                  <NextLink href={'/orderhistory'}>
                    <Link>Order History</Link>
                  </NextLink>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item md={9} xs={12} className={classess.section}>
            <Card>
              <CardContent>
                <Typography component="h1" variant="h1">
                  Profile
                </Typography>
              </CardContent>
              <CardContent>
                <List>
                  <ListItem>
                    <Controller
                      name="name"
                      control={control}
                      defaultValue={user.name}
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
                      name="email"
                      control={control}
                      defaultValue={user.email}
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
                      UPDATE
                    </Button>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
            {user.isAdmin && (
              <Card className={classess.section}>
                <CardContent>
                  <Typography variant="h5" component="h5">
                    Admin Menu
                  </Typography>
                </CardContent>
                <CardContent>
                  <List>
                    <ListItem>Admin Menu</ListItem>
                  </List>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </form>
    </Layout>
  );
}
export default dynamicSSR(OrderHistory);
