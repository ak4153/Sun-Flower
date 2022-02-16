import React from 'react';
import { Store } from '../utils/Store';
import { useContext } from 'react';
import Layout from './Layout';
import dynamicSSR from '../utils/dynamicFunction';

export default function Loading() {
  return <div>Loading...</div>;
}
// dynamicSSR(Loading);
