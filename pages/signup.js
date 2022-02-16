import { Typography } from '@material-ui/core';
import React from 'react';
import Layout from '../components/Layout';
import dynamicSSR from '../utils/dynamicFunction';

function SignupScreen() {
  return (
    <Layout>
      <Typography component="h1" variant="h1">
        Signup
      </Typography>
    </Layout>
  );
}

export default dynamicSSR(SignupScreen);
