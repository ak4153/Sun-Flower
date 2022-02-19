import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  navbar: {
    backgroundColor: '#203040',
    '& a': {
      color: '#ffffff',
      margin: 10,
    },
  },
  main: {
    minHeight: '80vh',
  },
  footer: {
    marginTop: 10,
    textAlign: 'center',
  },
  brand: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
  },
  grow: {
    flexGrow: 1,
  },
  //[slug] section of a product
  section: {
    marginTop: 20,
    marginBottom: 20,
  },
  form: {
    maxWidth: 800,
    margin: '0 auto',
  },
  navabarButtonm: {
    color: 'white',
    textTransform: 'initial',
  },
  transparentBackground: { backgroundColor: 'transparent' },
});
export default useStyles;
