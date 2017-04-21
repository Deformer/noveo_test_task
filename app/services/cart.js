/**
 * Created by sbelan on 4/19/2017.
 */
const CartRepository = require('../repositories/cart');
const { CartConstructor } = require('../helpers/constructors');

class CartService {
  constructor(store) {
    this.store = store;
    if (!this.isExist()) {
      this.store.cart = new CartConstructor();
      this.store.cartMaxAge = Date.now() + (5 * 60 * 1000);
    }
    this.repo = new CartRepository(store.cart);
  }
  isExist() {
    return !!this.store.cart;
  }
  addProduct(product, quantity, callback) {
    this.repo.add(product, quantity, callback);
  }

  removeProduct(product, callback) {
    this.repo.remove(product, callback);
  }

  getAllProducts(callback) {
    this.repo.getAll(callback);
  }
}
exports.CartService = CartService;
