import {
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import Layout from '../../../components/Layout';
import useStyles from '../../../utils/styles';
import axios from 'axios';
import { Store } from '../../../utils/Store';
import dynamicSSR from '../../../utils/dynamicFunction';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Controller, useForm } from 'react-hook-form';
import { Alert, AlertTitle } from '@material-ui/lab';
import AdminSideBar from '../../../components/AdminSideBar';
import db from '../../../utils/db';
import User from '../../../models/user';

function EditUser(props) {
  const classess = useStyles();
  const { state, dispatch } = useContext(Store);
  const { user } = state;
  const router = useRouter();
  const [alert, setAlert] = useState('');
  const userDataToEdit = props.user;
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(userDataToEdit.isAdmin);
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = useForm();

  const onSubmit = ({ email, name }) => {
    setLoading((prevstate) => (prevstate = true));
    axios
      .put(
        '/api/admin/users/edituser',
        {
          email: email,
          isAdmin: isAdmin,
          name: name,
          _id: userDataToEdit._id,
        },
        {
          headers: {
            authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((result) => {
        setLoading((prevstate) => (prevstate = false));
        setAlert({ message: 'Successfuly updated', variant: 'success' });
      })
      .catch(function (error) {
        setLoading((prevstate) => (prevstate = false));
        //error message for invalid signup

        setAlert({
          message: error.response.data.message,
          variant: 'warning',
        });
      });
  };
  useEffect(() => {
    if (!user && !user.isAdmin) router.push('/login');
  }, []);

  return (
    <Layout title={`Edit User ${userDataToEdit._id}`}>
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
          <AdminSideBar selected="users" />

          <Grid item md={9} xs={12} className={classess.section}>
            <Card>
              <CardContent>
                <Typography component="h1" variant="h1">
                  {`Edit User ${userDataToEdit._id}`}
                </Typography>
              </CardContent>
              <CardContent>
                <List>
                  <ListItem>
                    <Controller
                      name="name"
                      control={control}
                      defaultValue={userDataToEdit.name}
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
                      defaultValue={userDataToEdit.email}
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
                    <Typography>Is Admin?</Typography>
                    <Controller
                      control={control}
                      name={'isAdmin'}
                      render={({ field }) => (
                        <Checkbox
                          {...register('isAdmin', { required: false })}
                          id="isAdmin"
                          variant="outlined"
                          label="Is Admin"
                          checked={isAdmin}
                          onClick={(e) => setIsAdmin(e.target.checked)}
                          {...field}
                        />
                      )}
                    ></Controller>
                  </ListItem>
                  {/* 
                    <FormControlLabel
                      control={<Checkbox defaultChecked />}
                      label="Is Admin"
                    /> */}

                  <ListItem>
                    {loading ? (
                      <CircularProgress />
                    ) : (
                      <Button
                        align="center"
                        type="submit"
                        variant="contained"
                        color="primary"
                      >
                        UPDATE
                      </Button>
                    )}
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Layout>
  );
}
export async function getServerSideProps(context) {
  const { params } = context;
  const { id } = params;
  await db.connect();
  var user = await User.findById(id).lean();
  //pay close attention to .lean() which converts the document from mongodb
  //to a smaller javascript object
  //then we need to convert the _id,createdAt,updatedAt fields to string from plain objects
  //only numbers,string and bool are applicable
  user = db.convertDocToObj(user);

  await db.disconnect();
  return {
    props: {
      user,
    },
  };
}
export default dynamicSSR(EditUser);
