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
    //TODO here also add to cart
    case 'ADD_TO_CART': {
      const newItem = action.payload;

      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );

      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            existItem.name === item.name ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      Cookies.set('cartItems', JSON.stringify(cartItems));
      //...state.cart - spreadts the cart objects
      return { ...state, cart: { ...state.cart, cartItems } };
    }

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
