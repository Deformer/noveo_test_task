/**
 * Created by sbelan on 4/26/2017.
 */
const { CartConstructor } = require('../helpers/constructors');
const { CartService } = require('../services/cart');

exports.makeCart = (store) => {
  if (!store.cart) {
    store.cart = new CartConstructor();
    store.cartMaxAge = Date.now() + (5 * 60 * 1000);
  }
  return new CartService(store);
};
