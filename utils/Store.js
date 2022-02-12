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
};

//3.create a reducer function, takes state?
//and the action
const reducer = (state, action) => {
  console.log(action);
  switch (action.type) {
    case 'DARK_MODE_ON':
      //spreads the initialState and changes the dark mode
      return { ...state, darkMode: true };
    case 'DARK_MODE_OFF':
      return { ...state, darkMode: false };
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
