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
import Layout from '../components/Layout';
import useStyles from '../utils/styles';
import axios from 'axios';
import { Store } from '../utils/Store';
import dynamicSSR from '../utils/dynamicFunction';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import Error from '../components/Error';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST': {
      return { ...state, loading: true, error: '' };
    }
    case 'FETCH_SUCCESS': {
      return { ...state, orders: action.payload, loading: false, error: '' };
    }
    case 'FETCH_FAIL': {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    }
    default:
      state;
  }
}

function OrderHistory() {
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: false,
    error: '',
    orders: [],
  });
  const classess = useStyles();
  const { state } = useContext(Store);
  const { user } = state;
  const router = useRouter();
  const [alert, setAlert] = useState('');

  useEffect(() => {
    if (!user) router.push('/login');
    dispatch({ type: 'FETCH_REQUEST' });
    axios
      .get('/api/orders/getorders', {
        headers: { authorization: `Bearer ${user.token}` },
      })
      .then((result) => {
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
        console.log(result.data);
      })
      .catch((err) => {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
        setAlert(err.message);
      });
  }, []);

  return (
    <Layout title="Order History">
      {alert && <Error message={alert}></Error>}
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
                  <Link>Profile</Link>
                </NextLink>
              </Typography>
            </CardContent>
            <CardContent>
              <Typography>
                <NextLink href={'/profile'}>
                  <Link>
                    <strong>Order History</strong>
                  </Link>
                </NextLink>
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item md={9} xs={12} className={classess.section}>
          <Card>
            <CardContent>
              <Typography component="h1" variant="h1">
                Order History
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
                        <TableCell>DATE</TableCell>
                        <TableCell>TOTAL</TableCell>
                        <TableCell>PAID</TableCell>
                        <TableCell>DELIVERED</TableCell>
                        <TableCell>ACTION</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orders.map(
                        (order) =>
                          user._id === order.user && (
                            <TableRow key={order._id}>
                              <TableCell>{order._id.slice(-5, -1)}</TableCell>
                              <TableCell>{order.createdAt}</TableCell>
                              <TableCell>{order.totalPrice}</TableCell>
                              <TableCell>
                                {order.isPaid ? 'Paid' : 'Not paid'}
                              </TableCell>
                              <TableCell>
                                {order.isDelivered
                                  ? 'Delivered'
                                  : 'Not Delivered'}
                              </TableCell>
                              <TableCell>
                                <Button
                                  onClick={() =>
                                    router.push(`/order/${order._id}`)
                                  }
                                  variant="contained"
                                  color="secondary"
                                >
                                  DETAILS
                                </Button>
                              </TableCell>
                            </TableRow>
                          )
                      )}
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
export default dynamicSSR(OrderHistory);
