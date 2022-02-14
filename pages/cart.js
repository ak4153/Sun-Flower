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
} from '@material-ui/core';
import React, { useContext } from 'react';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import NextLink from 'next/link';
import Image from 'next/image';
//this function treats the
//Expected server HTML to contain a matching <span> in <a>.
//error, which means: server side didnt render what the client did
import dynamic from 'next/dynamic';

const CartScreen = () => {
  const { state } = useContext(Store);
  const { cartItems } = state.cart;

  return (
    <Layout title="Shopping Cart">
      <Typography variant="h1" component="h1">
        Shopping Cart
      </Typography>
      {cartItems == 0 ? (
        <div>
          Cart is empty. <NextLink href="/">Go to products</NextLink>
        </div>
      ) : (
        <Grid container spacing={1}>
          <Grid item md={9} xs={12}>
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
                    <TableCell align="right">
                      <Typography>Action</Typography>
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
                              width={50}
                              height={50}
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
                        <Select value={item.quantity}>
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <MenuItem key={x + 1} value={x + 1}>
                              {x + 1}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell align="right">${item.price}</TableCell>
                      <TableCell align="right">
                        <Button color="secondary">x</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item md={3} xs={12}>
            <List>
              <ListItem>
                <Typography variant="h2">
                  Subtotal (
                  {cartItems.reduce((acc, curr) => acc + curr.quantity, 0)}{' '}
                  items) : ${' '}
                  {cartItems.reduce(
                    (acc, curr) => acc + curr.price * curr.quantity,
                    0
                  )}
                </Typography>
              </ListItem>
              <ListItem>
                <Button variant="contained" fullWidth color="primary">
                  Check Out
                </Button>
              </ListItem>
            </List>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
};

//https://nextjs.org/docs/advanced-features/dynamic-import
//server doesnt load what the client did from cookies.
//so you need to disable SSR for this component
export default dynamic(() => Promise.resolve(CartScreen), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});
