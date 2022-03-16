import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
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
  navabarButton: {
    color: 'white',
    textTransform: 'initial',
  },
  transparentBackground: { backgroundColor: 'transparent' },
  indexCard: {
    width: '300px',
    height: '300px',
  },
  cardMedia: {
    width: '100%',
    height: '200px',
  },
  menuButton: {
    padding: 0,
  },
  searchSection: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
    flexGrow: '1',
  },
  searchForm: {
    border: '1px solid #ffffff',
    backgroundColor: '#ffffff',
    borderRadius: 5,
    padding: 0,
    margin: 0,
  },
  searchInput: {
    paddingLeft: 5,

    color: '#000000',
    '& ::placeholder': {
      color: '#000000',
    },
  },
  iconButton: {
    backgroundColor: '#f8c040',
    borderRadius: '0 5px 0 5px',
    padding: 5,
    '& span': {
      color: '#000000',
    },
  },
  reviewForm: {
    display: 'flex',
    flexDirection: 'column',
    alignItem: 'space-between',
    justifyContent: 'center',
  },
  mt1: {
    marginTop: '20px',
  },
  carouselImage: {
    height: '500px',
    width: '100%',
  },
}));
export default useStyles;
