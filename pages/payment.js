import {
  Button,
  FormControl,
  FormControlLabel,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useContext, useLayoutEffect, useState } from 'react';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
import dynamicSSR from '../utils/dynamicFunction';
import { Store } from '../utils/Store';
import useStyles from '../utils/styles';
function Payment() {
  const { state, dispatch } = useContext(Store);
  const { shippingData } = state;
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [alert, setAlert] = useState('');
  const classess = useStyles();

  useLayoutEffect(() => {
    if (!shippingData) {
      router.push('/shipping');
    } else {
      console.log(Cookies.get('paymentMethod'));
      setPaymentMethod(JSON.parse(Cookies.get('paymentMethod')) || '');
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (paymentMethod) {
      dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethod });
      router.push('/placeOrder');
    } else {
      setAlert("Payment Method isn't selected");
    }
  };
  return (
    <Layout title="Payment">
      <CheckoutWizard activeStep={2}></CheckoutWizard>
      {alert && (
        <Alert className={classess.section} severity="warning">
          {alert}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <Typography component="h1" variant="h1">
          Payment Method
        </Typography>
        <List>
          <ListItem>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="Payment Method"
                name="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  label="PayPal"
                  value="PayPal"
                  control={<Radio />}
                ></FormControlLabel>
                <FormControlLabel
                  label="Stripe"
                  value="Stripe"
                  control={<Radio />}
                ></FormControlLabel>
                <FormControlLabel
                  label="Pay On Delivery"
                  value="PayOnDelivery"
                  control={<Radio />}
                ></FormControlLabel>
              </RadioGroup>
            </FormControl>
          </ListItem>
        </List>
        <ListItem>
          <Button fullWidth type="submit" variant="contained" color="primary">
            Continue
          </Button>
        </ListItem>
        <ListItem>
          <Button
            fullWidth
            type="button"
            variant="contained"
            onClick={() => router.push('/shipping')}
          >
            Back
          </Button>
        </ListItem>
      </form>
    </Layout>
  );
}
export default dynamicSSR(Payment);
