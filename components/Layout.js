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
  Button,
  Menu,
  MenuItem,
  ListItem,
  List,
  Divider,
  TextField,
  Input,
} from '@material-ui/core';

import useStyles from '../utils/styles';
import NextLink from 'next/link';
import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { Store } from '../utils/Store';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { Box, IconButton } from '@mui/material';
import MenuIcon from '@material-ui/icons/Menu';
import Cancel from '@material-ui/icons/Cancel';
import { Drawer } from '@mui/material';

import axios from 'axios';
import SearchBox from './SearchBox';
export default function Layout({ children, title, description }) {
  const classes = useStyles();
  //const value = { state, dispatch };
  //useContext gets its value from distructring value
  const { state, dispatch } = useContext(Store);
  const { darkMode, cart } = state;
  const [mode, setMode] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();
  const open = Boolean(anchorEl);
  const classess = useStyles();
  const [sideBarVisible, setSideBarVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const sideBarOpenHandler = () => {
    setSideBarVisible(true);
  };
  const sideBarCloseHandler = () => {
    setSideBarVisible(false);
  };
  const handleClickMenu = (e) => {
    console.log(e.currentTarget);
    setAnchorEl(e.currentTarget);
  };
  const handleCloseMenu = (e) => {
    setAnchorEl(null);
  };
  const handleLogOut = () => {
    if (state.user) {
      dispatch({ type: 'LOGOUT_USER', payload: state.user });
      router.push('/');
    }
  };
  const darkModeChangeHandler = () => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' }, state);
    const newDarkMode = !darkMode;
    Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF');
  };
  useEffect(() => {
    axios
      .get('/api/products/categories')
      .then((res) => setCategories(res.data))
      .catch((err) => console.log(err));
  }, []);
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
            <Box display="flex" alignItems="center">
              <IconButton
                onClick={sideBarOpenHandler}
                edge="start"
                aria-label="open drawer"
              >
                <MenuIcon className={classess.navabarButton} />
              </IconButton>
            </Box>
            {/*NextLink is passing passHref
           for the Link to recieve it */}
            <NextLink href="/" passHref>
              <Link>
                <Typography className={classes.brand}>Sun Flower</Typography>
              </Link>
            </NextLink>

            <Drawer
              anchor="left"
              open={sideBarVisible}
              onClose={sideBarCloseHandler}
              className={classess.siderBar}
            >
              <List>
                <ListItem>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography>Shop by category</Typography>
                    <IconButton
                      aria-label="close"
                      onClick={sideBarCloseHandler}
                    >
                      <Cancel />
                    </IconButton>
                  </Box>
                </ListItem>
                <Divider light />
                {categories.map((cat) => (
                  <ListItem key={cat}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography>{cat}</Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Drawer>

            <div className={classess.searchSection}>
              <Box display="flex" justifyContent="space-between">
                <SearchBox></SearchBox>
              </Box>
            </div>
            <Switch checked={mode} onChange={darkModeChangeHandler}></Switch>
            <div>
              <NextLink href="/cart" passHref>
                <Link>
                  <Typography component="span">
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
                  </Typography>
                </Link>
              </NextLink>
            </div>
            {!state.user ? (
              <>
                <div>
                  <NextLink href="/login" passHref>
                    <Link>
                      <Typography component="span">Login</Typography>
                    </Link>
                  </NextLink>
                </div>
                <div>
                  <NextLink href="/signup" passHref>
                    <Link>
                      <Typography component="span">Signup</Typography>
                    </Link>
                  </NextLink>
                </div>
              </>
            ) : (
              <>
                <Button
                  id="basic-button"
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClickMenu}
                  className={classes.navbarButton}
                >
                  {state.user.name}
                </Button>

                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleCloseMenu}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  <MenuItem onClick={handleCloseMenu}>
                    <NextLink passHref href={'/profile'}>
                      <Link>Profile</Link>
                    </NextLink>
                  </MenuItem>
                  <MenuItem onClick={handleCloseMenu}>
                    <NextLink passHref href={'/orderhistory'}>
                      <Link>Order History</Link>
                    </NextLink>
                  </MenuItem>

                  {state.user.isAdmin && (
                    <MenuItem onClick={handleCloseMenu}>
                      <NextLink passHref href={'/admin/dashboard'}>
                        <Link>Admin Dashboard</Link>
                      </NextLink>
                    </MenuItem>
                  )}

                  <MenuItem onClick={handleLogOut}>Logout</MenuItem>
                </Menu>
              </>
            )}
          </Toolbar>
        </AppBar>
        <Container className={classes.main}>{children}</Container>
        <footer className={classes.footer}>
          <div className={classes.footerdiv}>
            <Typography>All Rights Reserved. Sun Flower 2022</Typography>
          </div>
        </footer>
      </ThemeProvider>
    </div>
  );
}
