import { Card, CardContent, Grid, Link, Typography } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';

import useStyles from '../utils/styles';

import { Store } from '../utils/Store';
import dynamicSSR from '../utils/dynamicFunction';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
/**
 *
 * @param {*} slected menu e.g {selected="Orders"}
 * @returns
 */
function AdminSideBar({ selected }) {
  const classess = useStyles();
  const { state, dispatch } = useContext(Store);
  const { user } = state;
  const router = useRouter();

  return (
    <>
      <Grid item xs={12} md={2}>
        <Card className={classess.section}>
          <CardContent>
            <Typography>
              <NextLink href={'/admin/dashboard'}>
                <Link>
                  {selected === 'dashboard' ? (
                    <strong>Dashboard</strong>
                  ) : (
                    'Dashboard'
                  )}
                </Link>
              </NextLink>
            </Typography>
          </CardContent>

          <CardContent>
            <Typography>
              <NextLink href={'/admin/orders'}>
                <Link>
                  {' '}
                  {selected === 'orders' ? <strong>Orders</strong> : 'Orders'}
                </Link>
              </NextLink>
            </Typography>
          </CardContent>
          <CardContent>
            <Typography>
              <NextLink href={'/admin/products'}>
                <Link>
                  {' '}
                  {selected === 'products' ? (
                    <strong>Products</strong>
                  ) : (
                    'Products'
                  )}
                </Link>
              </NextLink>
            </Typography>
          </CardContent>
          <CardContent>
            <Typography>
              <NextLink href={'/admin/users'}>
                <Link>
                  {' '}
                  {selected === 'users' ? <strong>Users</strong> : 'Users'}
                </Link>
              </NextLink>
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
}
export default dynamicSSR(AdminSideBar);
