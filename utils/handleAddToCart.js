import axios from 'axios';

const handleAddToCartFuncion = async (dispatch, product, router, state) => {
  const existItem = state.cart.cartItems.find(
    (item) => product.name === item.name
  );
  const quantity = existItem ? existItem.quantity + 1 : 1;
  axios
    .get(`/api/products/${product._id}`)
    .then((result) => {
      if (result.data.countInStock <= 0) {
        window.alert('sorry out of stock');
        return;
      }
    })
    .catch((err) => console.log(err));

  if (product.countInStock < quantity) {
    window.alert('not enough in stock');
    return;
  }
  dispatch({
    type: 'ADD_TO_CART',
    payload: {
      ...product,
      quantity: existItem ? (existItem.quantity += 1) : 1,
    },
  });
  router.push('/cart');
  return;
};
export default handleAddToCartFuncion;
