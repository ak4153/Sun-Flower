import { Alert } from '@material-ui/lab';
import React from 'react';
import useStyles from '../utils/styles';

/**
 *
 * @param {*} message
 * @param {*} severity
 * @returns
 */
export default function Error({ message, severity }) {
  const classess = useStyles();
  return (
    <>
      {message ? (
        <Alert className={classess.section} severity={severity || 'warning'}>
          {message || 'error'}
        </Alert>
      ) : (
        ''
      )}
    </>
  );
}
