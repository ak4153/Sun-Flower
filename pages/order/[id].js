import {
  Grid,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Link,
  Select,
  MenuItem,
  Button,
  List,
  ListItem,
  TableContainer,
  Card,
  CircularProgress,
} from '@material-ui/core';
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useReducer,
  useState,
} from 'react';
import Layout from '../../components/Layout';
import { Store } from '../../utils/Store';
import NextLink from 'next/link';
import Image from 'next/image';
//this function treats the
//Expected server HTML to contain a matching <span> in <a>.
//error, which means: server side didnt render what the client did
import dynamicSSR from '../../utils/dynamicFunction';
import axios from 'axios';
import Router, { useRouter } from 'next/router';
import useStyles from '../../utils/styles';
import CheckoutWizard from '../../components/CheckoutWizard';
import { getError } from '../../utils/error';
import { Alert } from '@material-ui/lab';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST': {
      return { ...state, loading: true, error: '' };
    }
    case 'FETCH_SUCCESS': {
      const data = action.payload;

      return {
        ...state,
        loading: false,
        order: { ...data },
        error: '',
      };
    }
    case 'FETCH_FAIL': {
      return { ...state, error: action.payload, loading: true };
    }
    case 'PAY_REQUEST': {
      return { ...state, error: '', loading: true };
    }
    case 'PAY_SUCCESS': {
      return {
        ...state,
        error: '',
        loading: false,
        successPay: true,
      };
    }
    case 'PAY_FAIL': {
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    }
    case 'PAY_RESET': {
      return {
        ...state,
        error: '',
        loading: false,
        successPay: false,
      };
    }
  }
}

const Order = ({ params }) => {
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const [{ loading, error, order, paymentData, successPay }, dispatch] =
    useReducer(reducer, {
      loading: true,
      order: {},
      error: '',
      paymentData: {},
    });
  const orderId = params.id;
  const classess = useStyles();
  const { state } = useContext(Store);

  const router = useRouter();
  const [alert, setAlert] = useState({ message: '', variant: '' });

  useEffect(() => {
    if (!state.user) {
      router.push('/login');
    }
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: {
            authorization: `Bearer ${state.user.token}`,
          },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });

        setAlert({ message: getError(err), variant: 'danger' });
      }
    };
    if (!order._id || successPay || (order._id && order._id !== orderId)) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
    } else {
      //paypal entry point
      //gets paypal clientId from backend
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal', {
          headers: { authorization: `Bearer ${state.user.token}` },
        });

        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'USD',
          },
        });

        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      loadPaypalScript();
    }
  }, [order, successPay]);

  //pay button>this FIRES
  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  }
  //payment success>goes here

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: 'PAY_REQUEST' });
        //put request goes but loading error
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          { details: details, orderId: order._id },
          {
            headers: { authorization: `Bearer ${state.user.token}` },
          }
        );
        dispatch({ type: 'PAY_SUCCESS', payload: data });
        setAlert({ message: 'Order is paid', variant: 'info' });
      } catch (error) {
        dispatch({ type: 'PAY_FAIL', payload: getError(err) });
        setAlert({ message: getError(err), variant: 'warning' });
      }
    });
  }

  function onError(err) {
    setAlert({ message: getError(err), variant: 'error' });
  }

  return (
    <Layout title={`Order ${orderId}`}>
      <Typography className={classess.section} variant="h1" component="h1">
        Order {orderId}
      </Typography>
      {alert.message && <Alert severity={alert.variant}>{alert.message}</Alert>}
      <CheckoutWizard activeStep={4}></CheckoutWizard>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="warning">{error}</Alert>
      ) : (
        <Grid container spacing={1}>
          <Grid item md={9} xs={12}>
            <Card className={classess.section}>
              <List>
                <ListItem>
                  <Typography component="h2" variant="h2">
                    Shipping Address
                  </Typography>
                </ListItem>
                <ListItem>
                  {order.shippingData.fullName}, {order.shippingData.address},{' '}
                  {order.shippingData.postalCode}, {order.shippingData.country},{' '}
                  {order.shippingData.city}
                </ListItem>
                <ListItem>
                  Status:
                  {order.isDelivered
                    ? `Delivered at ${order.deliveredAt} `
                    : 'Not delivered'}
                </ListItem>
              </List>
            </Card>

            <Card className={classess.section}>
              <List>
                <ListItem>
                  <Typography component="h2" variant="h2">
                    Payment
                  </Typography>
                </ListItem>

                <ListItem>Payment Method: {order.paymentMethod}</ListItem>
                <ListItem>
                  <Typography>
                    Payment status:{' '}
                    {order.isPaid ? `P aid at ${order.paidAt}` : 'Not paid'}
                  </Typography>
                </ListItem>
              </List>
            </Card>

            <Card className={classess.section}>
              <List>
                <ListItem>
                  <Typography component="h2" variant="h2">
                    Order Items
                  </Typography>
                </ListItem>
                <ListItem>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <Typography>Image</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>Name</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography>Quantity</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography>Price</Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {order.orderItems.map((item) => (
                          <TableRow key={item._id}>
                            <TableCell>
                              <NextLink href={`/product/${item.slug}`}>
                                <Link>
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={10}
                                    height={10}
                                    layout="responsive"
                                  />
                                </Link>
                              </NextLink>
                            </TableCell>
                            <TableCell>
                              <Typography>
                                <NextLink href={`/product/${item.slug}`}>
                                  <Link>{item.name}</Link>
                                </NextLink>
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography>{item.quantity}</Typography>
                            </TableCell>
                            <TableCell align="right">${item.price}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </ListItem>
              </List>
            </Card>
          </Grid>
          <Grid item md={3} xs={12}>
            <Card className={classess.section}>
              <List>
                <ListItem>
                  <Typography variant="h2">Order Summary</Typography>
                </ListItem>

                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Items:</Typography>
                      <Grid item xs={6}>
                        <Typography>{order.orderItems.length}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </ListItem>

                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Price:</Typography>
                      <Grid item xs={6}>
                        <Typography>
                          $
                          {Math.round(
                            order.totalPrice - order.shippingPrice - order.tax
                          )}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </ListItem>

                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Shipping:</Typography>
                      <Grid item xs={6}>
                        <Typography>${order.shippingPrice}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </ListItem>

                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Tax:</Typography>
                      <Grid item xs={6}>
                        <Typography>${order.tax}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </ListItem>

                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>
                        <strong>Total:</strong>
                      </Typography>
                      <Grid item xs={6}>
                        <Typography>
                          <strong>${order.totalPrice}</strong>
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </ListItem>
                {!order.isPaid && (
                  <ListItem>
                    {isPending ? (
                      <CircularProgress></CircularProgress>
                    ) : (
                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    )}
                  </ListItem>
                )}
              </List>
            </Card>
          </Grid>

          {/* */}
        </Grid>
      )}
    </Layout>
  );
};

//this will use the params from the url and pass it as props
export async function getServerSideProps({ params }) {
  return { props: { params } };
}
//https://nextjs.org/docs/advanced-features/dynamic-import
//server doesnt load what the client did from cookies.
//so you need to disable SSR for this component
export default dynamicSSR(Order);
