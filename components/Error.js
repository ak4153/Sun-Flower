import { Alert } from '@material-ui/lab';
import React from 'react';
import useStyles from '../utils/styles';

export default function Error({ message, severity }) {
  const classess = useStyles();
  return (
    <Alert className={classess.section} severity={severity || 'warning'}>
      {message}
    </Alert>
  );
}
