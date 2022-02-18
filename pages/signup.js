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
function SignupScreen() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [name, setName] = useState();
  const { dispatch } = useContext(Store);
  const classes = useStyles();
  const router = useRouter();
  const [alert, setAlert] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
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
  };
  return (
    <Layout title="Signup">
      <form onSubmit={handleSubmit} className={classes.form}>
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
            <TextField
              id="email__signup"
              label="Email"
              fullWidth
              variant="outlined"
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </ListItem>
          <ListItem>
            <TextField
              id="name__signup"
              label="Name"
              fullWidth
              variant="outlined"
              type="text"
              required
              onChange={(e) => setName(e.target.value)}
            />
          </ListItem>
          <ListItem>
            <TextField
              id="password__signup"
              label="Password"
              variant="outlined"
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
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
