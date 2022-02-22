import axios from 'axios';

const handleAddToCartFuncion = async (
  dispatch,
  product,
  router,
  state,
  setAlert
) => {
  const existItem = state.cart.cartItems.find(
    (item) => product.name === item.name
  );
  const quantity = existItem ? existItem.quantity + 1 : 1;
  axios
    .get(`/api/products/${product._id}`)
    .then((result) => {
      if (result.data.countInStock <= 0) {
        return setAlert({ message: 'Out of stock', variant: 'warning' });
      }
    })
    .catch((err) => console.log(err));

  if (product.countInStock < quantity) {
    return setAlert({ message: 'Out of stock', variant: 'warning' });
  }
  dispatch({
    type: 'ADD_TO_CART',
    payload: {
      ...product,
      quantity: existItem ? (existItem.quantity += 1) : 1,
    },
  });
  router.push('/cart');
  return false;
};
export default handleAddToCartFuncion;
