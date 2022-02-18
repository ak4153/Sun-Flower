import { Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';

export default function Shipping() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { user } = state;
  if (!user) {
    router.push('/login?redirect=/shipping');
  }
  return (
    <Layout title="Shipping">
      <Typography>Shipping</Typography>
    </Layout>
  );
}
