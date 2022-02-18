import { createContext, useReducer } from 'react';
import Cookies from 'js-cookie';
//1.create context component
export const Store = createContext();
//this will be use
//const { state, dispatch } = useContext(Store);
//inside the desired component

//2.set the initial state
const initialState = {
  darkMode: Cookies.get('darkMode') == 'ON' ? true : false,
  cart: {
    cartItems: Cookies.get('cartItems')
      ? JSON.parse(Cookies.get('cartItems'))
      : [],
  },
  user: Cookies.get('user') ? JSON.parse(Cookies.get('user')) : '',
};

//3.create a reducer function, takes state?
//and the action
const reducer = (state, action) => {
  console.log('action', action.type);
  switch (action.type) {
    case 'DARK_MODE_ON':
      //spreads the initialState and changes the dark mode
      return { ...state, darkMode: true };
    case 'DARK_MODE_OFF':
      return { ...state, darkMode: false };
    case 'ADD_TO_CART': {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );

      const cartItems = existItem
        ? state.cart.cartItems.map((item) => {
            if (item.name === existItem.name) {
              return newItem;
            }
            return item;
          })
        : [...state.cart.cartItems, newItem];
      Cookies.set('cartItems', JSON.stringify(cartItems));
      //...state.cart - spreads the cart objects
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'REMOVE_FROM_CART': {
      const itemToRemove = action.payload;
      console.log('itemToRemove', itemToRemove);
      const cartItems = state.cart.cartItems.filter(
        (item) => itemToRemove._id !== item._id
      );
      Cookies.set('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'SET_USER': {
      const user = action.payload;
      console.log('user:', user);
      if (user) {
        Cookies.set('user', JSON.stringify(user));
        return { ...state, user: user };
      } else {
        return { ...state };
      }
    }
    case 'LOGOUT_USER': {
      const user = action.payload;
      Cookies.remove('user');
      Cookies.remove('cartItems');
      return { ...state, user: '', cart: { cartItems: [] } };
    }
    // case 'SIGNUP_USER': {

    // }
    default:
      return state;
  }
};
//4.create the provider component
export const StoreProvider = (props) => {
  //5.useReducer hook
  //6.declare the value object which will allow accessing
  //the reducer

  //dark mode state
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
};
