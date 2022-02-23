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
    display: 'flex',
    justifyContent: 'center',
    flexFlow: 'row',
    marginTop: 20,
    textAlign: 'center',
  },
  footerdiv: {
    borderTop: '2px solid grey',
    padding: 20,
    width: '80%',
  },
  brand: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
  },
  grow: {
    flexGrow: 1,
  },
  addPadding: {
    padding: 10,
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
