import React from 'react';
import { Stepper, StepLabel, Step } from '@material-ui/core';
import useStyles from '../utils/styles';
export default function CheckoutWizard({ activeStep = 0 }) {
  const steps = ['Login', 'Shipping Address', 'Payment Method', 'Place Order'];
  const classess = useStyles();
  return (
    <Stepper
      className={classess.transparentBackground}
      activeStep={activeStep}
      alternativeLabel
    >
      {steps.map((step) => (
        <Step key={step}>
          <StepLabel>{step}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
