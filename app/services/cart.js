/**
 * Created by sbelan on 4/19/2017.
 */
const CartRepository = require('../repositories/cart');

class CartService {
  constructor(store) {
    this.repo = new CartRepository(store.cart);
  }

  isEmpty(callback) {
    this.repo.getAll((cart) => {
      callback(cart.data.products.length === 0);
    });
  }

  addProduct(product, quantity, callback) {
    const { price, _id } = product;
    const index = this.repo.indexOfProduct(_id);
    if (index === -1) {
      this.repo.create(product, quantity, () => {
        this.repo.updateCartStats(quantity, quantity * price, callback);
      });
    } else {
      this.addToExistedProduct(_id, product, quantity, callback);
    }
  }

  addToExistedProduct(id, product, quantity, callback) {
    const { price } = product;
    this.repo.get(id, (result) => {
      const currentProduct = result;
      currentProduct.quantity += quantity;
      currentProduct.sum += quantity * price;
      this.repo.update(id, currentProduct, () => {
        this.repo.updateCartStats(quantity, quantity * price, callback);
      });
    });
  }

  removeProduct(product, callback) {
    const { price, _id } = product;
    const index = this.repo.indexOfProduct(_id);
    if (index === -1) {
      callback('Такого продукта нет в корзине');
      return;
    }
    this.repo.get(_id, (result) => {
      const currentProduct = result;
      if (currentProduct.quantity === 1) {
        this.repo.remove(_id, () => {
          this.repo.updateCartStats(-1, -price, callback);
        });
      } else {
        this.decreaseProductQuantity(_id, product, callback);
      }
    });
  }

  decreaseProductQuantity(id, product, callback) {
    const { price } = product;
    this.repo.get(id, (result) => {
      const currentProduct = result;
      currentProduct.quantity -= 1;
      currentProduct.sum -= price;
      this.repo.update(id, currentProduct, () => {
        this.repo.updateCartStats(-1, -price, callback);
      });
    });
  }

  getAllProducts(callback) {
    this.repo.getAll(callback);
  }

}
exports.CartService = CartService;
