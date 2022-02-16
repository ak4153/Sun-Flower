import Head from 'next/head';
import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Link,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Switch,
  Badge,
} from '@material-ui/core';
import useStyles from '../utils/styles';
import NextLink from 'next/link';
import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { Store } from '../utils/Store';
import Cookies from 'js-cookie';

export default function Layout({ children, title, description }) {
  const classes = useStyles();
  //const value = { state, dispatch };
  //useContext gets its value from distructring value
  const { state, dispatch } = useContext(Store);
  //TODO badge  video 16 757
  const { darkMode, cart } = state;
  const [mode, setMode] = useState(false);

  const darkModeChangeHandler = () => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' }, state);
    const newDarkMode = !darkMode;
    Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF');
  };

  //wrap elements you want to provide the theme for
  //with <ThemeProvider theme={theme}>{children}</ThemeProvider>
  //then go to the children and add <Child variant=<class>/>
  const theme = createTheme({
    typography: {
      h1: {
        fontSize: '1.6rem',
        fontWeight: 400,
        magin: '1rem 0',
      },
      h2: {
        fontSize: '1.4rem',
        fontWeight: 400,
        magin: '1rem 0',
      },
      body1: {
        fontWeight: 'normal',
      },
    },

    palette: {
      type: mode ? 'dark' : 'light',
      primary: {
        main: '#f0c000',
      },
      secondary: {
        main: '#208080',
      },
    },
  });
  //fixes the darkmode white flicker
  useLayoutEffect(() => {
    setMode(darkMode);
  }, [darkMode]);

  return (
    <div>
      <Head>
        <title>{title ? `${title} - Sun Flower` : 'Sun Flower'}</title>

        {description && <meta name="description" content={description}></meta>}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/*has to be set for working with <ThemeProvider> */}
        <AppBar position="static" className={classes.navbar}>
          {/*NavBar */}
          <Toolbar>
            {/*NextLink is passing passHref
           for the Link to recieve it */}
            <NextLink href="/" passHref>
              <Link>
                <Typography className={classes.brand}>Sun Flower</Typography>
              </Link>
            </NextLink>
            <div className={classes.grow}></div>
            <Switch checked={mode} onChange={darkModeChangeHandler}></Switch>
            <div>
              <NextLink href="/cart" passHref>
                <Link>
                  {cart.cartItems.length > 0 ? (
                    <Badge
                      color="secondary"
                      badgeContent={cart.cartItems.reduce(
                        (acc, curr) => acc + curr.quantity,
                        0
                      )}
                    >
                      Cart
                    </Badge>
                  ) : (
                    'Cart'
                  )}
                </Link>
              </NextLink>
            </div>
            <div>
              <NextLink href="/login" passHref>
                <Link>Login</Link>
              </NextLink>
            </div>
            <div>
              <NextLink href="/signup" passHref>
                <Link>Signup</Link>
              </NextLink>
            </div>
          </Toolbar>
        </AppBar>
        <Container className={classes.main}>{children}</Container>
        <footer className={classes.footer}>
          <Typography>All Rights Reserved. Sun Flower 2022</Typography>
        </footer>
      </ThemeProvider>
    </div>
  );
}
