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
import Error from '../../components/Error';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST': {
      return { ...state, loading: true, error: '' };
    }
    case 'FETCH_SUCCESS': {
      return { ...state, products: action.payload, loading: false, error: '' };
    }
    case 'FETCH_FAIL': {
      return {
        ...state,
        products: action.payload,
        loading: false,
        error: 'failed to fetch products',
      };
    }
    default:
      state;
  }
}

function ProductsHistory() {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    loading: false,
    error: '',
    products: [],
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
      .get('/api/admin/products', {
        headers: { authorization: `Bearer ${user.token}` },
      })
      .then((result) => {
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      })
      .catch((err) => setAlert(err.message));
  }, []);

  return (
    <Layout title="product History">
      {alert && <Error message={alert}></Error>}
      <Grid
        spacing={1}
        container
        className={classess.section}
        justifyContent="center"
      >
        <AdminSideBar selected={'products'}></AdminSideBar>

        <Grid item md={9} xs={12} className={classess.section}>
          <Card>
            <CardContent>
              <Typography component="h1" variant="h1">
                Products
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
                        <TableCell>PRICE</TableCell>
                        <TableCell>CATEGORY</TableCell>
                        <TableCell>STOCK</TableCell>
                        <TableCell>RATING</TableCell>
                        <TableCell>ACTIONS</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product._id}>
                          <TableCell>{product._id.slice(-5, -1)}</TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.price}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>{product.countInStock}</TableCell>
                          <TableCell>{product.rating}</TableCell>
                          <TableCell>
                            <Grid container spacing={1}>
                              <Grid item>
                                <Button
                                  size="small"
                                  onClick={() =>
                                    router.push(`/admin/product/${product._id}`)
                                  }
                                  variant="contained"
                                  color="secondary"
                                >
                                  EDIT
                                </Button>
                              </Grid>
                              <Grid item>
                                <Button
                                  onClick={() =>
                                    router.push(`/admin/product/${product._id}`)
                                  }
                                  size="small"
                                  variant="contained"
                                  color="secondary"
                                >
                                  DELETE
                                </Button>
                              </Grid>
                            </Grid>
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
export default dynamicSSR(ProductsHistory);
