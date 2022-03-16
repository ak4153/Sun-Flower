import {
  Button,
  Grid,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab/';
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import Layout from '../components/Layout';
import dynamicSSR from '../utils/dynamicFunction';
import useStyles from '../utils/styles';
import { useRouter } from 'next/router';
import { Store } from '../utils/Store';
import { Controller, useForm } from 'react-hook-form';
import CheckoutWizard from '../components/CheckoutWizard';
function Shipping() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
    watch,
  } = useForm();

  const { state, dispatch } = useContext(Store);
  const classes = useStyles();
  const router = useRouter();
  const [alert, setAlert] = useState('');

  const { fullName, address, country, postalCode, city, lng, lat } =
    state.shippingData;
  const onSubmit = ({ fullName, address, city, postalCode, country }) => {
    if (fullName && address && city && postalCode && country) {
      router.push('/payment');
    }
  };

  useEffect(() => {
    //useForm hook watching for changes in input
    const subscription = watch((value) => {
      dispatch({ type: 'SHIPPING_DATA', payload: value });
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useLayoutEffect(() => {
    if (!state.user) {
      router.push('/login?redirect=/shipping');
    }
  }, []);

  return (
    <Layout title="Signup">
      <CheckoutWizard activeStep={1}></CheckoutWizard>
      <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
        <Typography component="h1" variant="h1">
          Shipping Address
        </Typography>

        <List>
          <ListItem>
            <Controller
              name="fullName"
              control={control}
              defaultValue={fullName}
              rules={{
                required: true,
                minLength: 3,
              }}
              render={({ field }) => (
                <TextField
                  {...register('fullName', { required: true })}
                  id="fullName"
                  label="Full Name"
                  fullWidth
                  variant="outlined"
                  type="text"
                  {...register('fullName')}
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.fullName)}
                  helperText={
                    errors.fullName
                      ? errors.fullName.type === 'pattern'
                        ? "fullName isn't valid"
                        : 'fullName is required'
                      : ''
                  }
                  {...field}
                />
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name="address"
              control={control}
              defaultValue={address}
              rules={{
                required: true,
                minLength: 3,
              }}
              render={({ field }) => (
                <TextField
                  {...register('address', { required: true })}
                  id="address"
                  label="Address"
                  fullWidth
                  variant="outlined"
                  type="text"
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.address)}
                  helperText={
                    errors.address
                      ? errors.address.type === 'pattern'
                        ? "address isn't valid"
                        : 'address is required'
                      : ''
                  }
                  {...field}
                />
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name="city"
              control={control}
              defaultValue={city}
              rules={{
                required: true,
                minLength: 3,
              }}
              render={({ field }) => (
                <TextField
                  {...register('city', { required: true })}
                  id="city"
                  label="City"
                  fullWidth
                  variant="outlined"
                  type="text"
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.city)}
                  helperText={
                    errors.city
                      ? errors.city.type === 'pattern'
                        ? "city isn't valid"
                        : 'city is required'
                      : ''
                  }
                  {...field}
                />
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name="postalCode"
              control={control}
              defaultValue={postalCode}
              rules={{
                required: true,
                minLength: 3,
              }}
              render={({ field }) => (
                <TextField
                  {...register('postalCode', { required: true })}
                  id="postalCode"
                  label="Postal Code"
                  fullWidth
                  variant="outlined"
                  type="text"
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.postalCode)}
                  helperText={
                    errors.postalCode
                      ? errors.postalCode.type === 'pattern'
                        ? "postalCode isn't valid"
                        : 'postalCode is required'
                      : ''
                  }
                  {...field}
                />
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name="country"
              control={control}
              defaultValue={country}
              rules={{
                required: true,
                minLength: 3,
              }}
              render={({ field }) => (
                <TextField
                  {...register('country', { required: true })}
                  id="country"
                  label="Country"
                  fullWidth
                  variant="outlined"
                  type="text"
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.country)}
                  helperText={
                    errors.country
                      ? errors.country.type === 'pattern'
                        ? "country isn't valid"
                        : 'country is required'
                      : ''
                  }
                  {...field}
                />
              )}
            ></Controller>
          </ListItem>

          <ListItem>
            <Grid container spacing={5} alignItems="center">
              <Grid item>
                <Button
                  variant="contained"
                  fullWidth
                  color="primary"
                  onClick={() => router.push('/map')}
                >
                  Map
                </Button>
              </Grid>
              <Grid item>
                {lat && lng && (
                  <>
                    <Typography>Latitude: {lat}</Typography>
                    <Typography>Longitude: {lng}</Typography>
                  </>
                )}
              </Grid>
            </Grid>
          </ListItem>

          <ListItem>
            <Button
              fullWidth
              align="center"
              type="submit"
              variant="contained"
              color="primary"
            >
              continue
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}

export default dynamicSSR(Shipping);
