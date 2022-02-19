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
} from '@material-ui/core';
import React, { useContext, useLayoutEffect } from 'react';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import NextLink from 'next/link';
import Image from 'next/image';
//this function treats the
//Expected server HTML to contain a matching <span> in <a>.
//error, which means: server side didnt render what the client did
import dynamicSSR from '../utils/dynamicFunction';
import axios from 'axios';
import Router, { useRouter } from 'next/router';
import useStyles from '../utils/styles';
import CheckoutWizard from '../components/CheckoutWizard';

const PlaceOrder = () => {
  const classess = useStyles();
  const { state, dispatch } = useContext(Store);
  const { cartItems } = state.cart;
  const { shippingData } = state;
  const router = useRouter();
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  const itemsPrice = cartItems.reduce(
    (acc, curr) => acc + curr.price * curr.quantity,
    0
  );
  const tax = round2(itemsPrice * 0.17);
  const shippingPrice = 8;
  const handleCheckOut = (e) => {
    router.push('/shipping');
  };
  useLayoutEffect(() => {
    if (!state.paymentMethod) {
      router.push('/payment');
    }
  });
  return (
    <Layout title="Shopping Cart">
      <Typography className={classess.section} variant="h1" component="h1">
        Place Order
      </Typography>
      <CheckoutWizard activeStep={3}></CheckoutWizard>
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
                {shippingData.fullName}, {shippingData.address},{' '}
                {shippingData.postalCode}, {shippingData.country},{' '}
                {shippingData.city}
              </ListItem>
            </List>
          </Card>

          <Card className={classess.section}>
            <List>
              <ListItem>
                <Typography component="h2" variant="h2">
                  Payment Method
                </Typography>
              </ListItem>
              <ListItem>{state.paymentMethod}</ListItem>
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
                      {cartItems.map((item) => (
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
                      <Typography>{cartItems.length}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </ListItem>

              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Price:</Typography>
                    <Grid item xs={6}>
                      <Typography>${itemsPrice}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </ListItem>

              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Shipping:</Typography>
                    <Grid item xs={6}>
                      <Typography>${shippingPrice}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </ListItem>

              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Tax:</Typography>
                    <Grid item xs={6}>
                      <Typography>${tax}</Typography>
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
                        <strong>${shippingPrice + tax + itemsPrice}</strong>
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </ListItem>

              <ListItem>
                <Button
                  variant="contained"
                  fullWidth
                  color="primary"
                  onClick={handleCheckOut}
                >
                  Place Order
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>

        {/* */}
      </Grid>
    </Layout>
  );
};

//https://nextjs.org/docs/advanced-features/dynamic-import
//server doesnt load what the client did from cookies.
//so you need to disable SSR for this component
export default dynamicSSR(PlaceOrder);
