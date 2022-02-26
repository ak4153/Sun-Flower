import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Link,
  List,
  ListItem,
  TextField,
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
import { Controller, useForm } from 'react-hook-form';
import { Alert, AlertTitle } from '@material-ui/lab';
import AdminSideBar from '../../components/AdminSideBar';
import Error from '../../components/Error';
import Chart from '../../components/Chart';
import { DateTime } from 'luxon';
function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST': {
      return { ...state, loading: true, error: '' };
    }
    case 'FETCH_SUCCESS': {
      const { users, orders, products, totalPrice, salesData } = action.payload;
      return {
        ...state,
        orders: orders,
        loading: false,
        error: '',
        users: users,
        products: products,
        totalPrice: totalPrice,
        salesData: salesData,
      };
    }
    case 'FETCH_FAIL': {
      return {
        ...state,
        loading: false,
        error: 'failed to fetch',
      };
    }
    default: {
      state;
    }
  }
}

function OrderHistory() {
  const classess = useStyles();
  const { state } = useContext(Store);
  const { user } = state;
  const router = useRouter();

  const [
    { orders, users, loading, error, products, totalPrice, salesData },
    dispatch,
  ] = useReducer(reducer, {
    loading: false,
    error: '',
    orders: [],
    users: '',
    products: '',
    totalPrice: '',
    salesData: [],
  });

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Bar Chart',
      },
    },
  };

  const labels = salesData.map((data) => data._id);

  const data = {
    labels,
    datasets: [
      {
        label: 'Sales',
        data: salesData.map((data) => data.totalPrice),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  useEffect(() => {
    if (!user && !user.isAdmin) return router.push('/login');
    dispatch({ type: 'FETCH_REQUEST' });
    axios
      .get('/api/admin', {
        headers: { authorization: `Bearer ${user.token}` },
      })
      .then((result) => {
        console.log(result.data.orders);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      })
      .catch((err) => {
        dispatch({ type: 'FETCH_FAIL' });
      });
  });

  return (
    <Layout title="Admin Dashboard">
      {error && <Error message={error}></Error>}
      <Grid
        spacing={1}
        container
        className={classess.section}
        justifyContent="center"
      >
        <AdminSideBar selected="dashboard" />

        <Grid item md={10} xs={12}>
          <Card>
            <Grid
              container
              spacing={3}
              className={(classess.section, classess.addPadding)}
            >
              {loading && (
                <Grid item xs={12} md={12}>
                  <CircularProgress />
                </Grid>
              )}

              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography component="h6" variant="h6">
                      ${totalPrice}
                    </Typography>
                  </CardContent>
                  <CardContent>
                    <Typography component="h5" variant="h5">
                      Sales
                    </Typography>
                  </CardContent>
                  <CardContent>
                    <Button fullWidth variant="contained" color="primary">
                      DETAILS
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography component="h6" variant="h6">
                      {orders.length}
                    </Typography>
                  </CardContent>

                  <CardContent>
                    <Typography component="h5" variant="h5">
                      Orders
                    </Typography>
                  </CardContent>
                  <CardContent>
                    <Button fullWidth variant="contained" color="primary">
                      DETAILS
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography component="h6" variant="h6">
                      {products}
                    </Typography>
                  </CardContent>

                  <CardContent>
                    <Typography component="h5" variant="h5">
                      Products
                    </Typography>
                  </CardContent>
                  <CardContent>
                    <Button fullWidth variant="contained" color="primary">
                      DETAILS
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography component="h6" variant="h6">
                      {users}
                    </Typography>
                  </CardContent>
                  <CardContent>
                    <Typography component="h5" variant="h5">
                      Users
                    </Typography>
                  </CardContent>
                  <CardContent>
                    <Button fullWidth variant="contained" color="primary">
                      DETAILS
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <Grid item>
              <Chart data={data} labels={labels} options={options}></Chart>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}
export default dynamicSSR(OrderHistory);
