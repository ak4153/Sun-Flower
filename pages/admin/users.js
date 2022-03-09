import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Link,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import Layout from '../../components/Layout';
import useStyles from '../../utils/styles';
import axios from 'axios';
import { Store } from '../../utils/Store';
import dynamicSSR from '../../utils/dynamicFunction';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import AdminSideBar from '../../components/AdminSideBar';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST': {
      return { ...state, loading: true, error: '' };
    }
    case 'FETCH_SUCCESS': {
      return { ...state, users: action.payload, loading: false, error: '' };
    }
    case 'FETCH_FAIL': {
      return {
        ...state,
        users: action.payload,
        loading: false,
        error: 'failed to fetch users',
      };
    }
    case 'RESET_REQUEST': {
      return { ...state, loadingReset: true, errorReset: '' };
    }
    case 'RESET_SUCCESS': {
      return { ...state, loadingReset: false, errorReset: '' };
    }
    case 'RESET_FAIL': {
      return {
        ...state,

        loadingReset: false,
        errorReset: 'failed to reset users',
      };
    }
    default:
      state;
  }
}

function Users() {
  const [{ loading, error, users, loadingReset, errorReset }, dispatch] =
    useReducer(reducer, {
      loading: false,
      error: '',
      users: [],
      loadingReset: false,
      errorReset: '',
    });
  const classess = useStyles();
  const { state } = useContext(Store);
  const { user } = state;
  const router = useRouter();
  const [alert, setAlert] = useState('');

  useEffect(() => {
    if (!user && !user.isAdmin) router.push('/login');
    dispatch({ type: 'FETCH_REQUEST' });
    axios
      .get('/api/admin/users', {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((result) => {
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
        console.log(result.data);
      })
      .catch((err) => {
        dispatch({ type: 'FETCH_FAIL' });

        setAlert(err.message);
      });
  }, []);

  const handleResetPassword = (id) => {
    dispatch({ type: 'RESET_REQUEST' });

    axios
      .put(`/api/admin/users/resetpassword?id=${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((result) => {
        dispatch({ type: 'RESET_SUCCESS' });
        console.log(result.data);
      })
      .catch((err) => {
        dispatch({ type: 'RESET_FAIL' });

        setAlert(err.message);
      });
  };

  return (
    <Layout title="Users">
      <Grid
        spacing={1}
        container
        className={classess.section}
        justifyContent="center"
      >
        <AdminSideBar selected="users"></AdminSideBar>

        <Grid item md={9} xs={12} className={classess.section}>
          <Card>
            <CardContent>
              <Typography component="h1" variant="h1">
                Users
              </Typography>
            </CardContent>

            <List>
              {loading && <CircularProgress />}
              <ListItem>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>NAME</TableCell>
                        <TableCell>DATE</TableCell>
                        <TableCell>IS ADMIN</TableCell>
                        <TableCell>ACTIONS</TableCell>
                        <TableCell>EDIT</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map((u) => (
                        <TableRow key={u._id}>
                          <TableCell>{u._id.slice(0, 999)}</TableCell>
                          <TableCell>{u.name}</TableCell>
                          <TableCell>{u.email}</TableCell>
                          <TableCell>{u.isAdmin ? 'Yes' : 'No'}</TableCell>

                          <TableCell>
                            {loadingReset ? (
                              <CircularProgress />
                            ) : (
                              <Button
                                size="small"
                                onClick={() => handleResetPassword(u._id)}
                                variant="contained"
                                color="secondary"
                              >
                                RESET PASSWORD
                              </Button>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              onClick={() =>
                                router.push(`/admin/user/${u._id}`)
                              }
                              variant="contained"
                              color="secondary"
                            >
                              EDIT
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default dynamicSSR(Users);
