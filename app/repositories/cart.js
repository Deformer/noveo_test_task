/**
 * Created by sbelan on 4/19/2017.
 */
const { CartConstructor } = require('../helpers/constructors');

class CartRepository {
  constructor(store) {
    this.cartStore = store;
  }

  add(product, quantity, callback) {
    const { price, _id } = product;
    const index = this.indexOfProduct(_id);

    this.cartStore.data.products_count += quantity;
    this.cartStore.data.total_sum += quantity * price;
    if (index === -1) {
      this.cartStore.data.products.push({
        id: _id,
        quantity,
        sum: quantity * price,
      });
      callback();
      return;
    }
    const currentProduct = this.cartStore.data.products[index];
    currentProduct.quantity += quantity;
    currentProduct.sum += quantity * price;
    callback();
  }

  remove(product, callback) {
    const { price, _id } = product;
    const index = this.indexOfProduct(_id);
    if (index === -1) {
      callback('Такого продукта нет в корзине');
      return;
    }
    const currentProduct = this.cartStore.data.products[index];
    this.cartStore.data.total_sum -= price;
    this.cartStore.data.products_count -= 1;
    if (currentProduct.quantity === 1) {
      this.cartStore.data.products.splice(index, 1);
    } else {
      currentProduct.quantity -= 1;
      currentProduct.sum -= price;
    }
    callback();
  }

  get(callback) {
    const cart = this.cartStore;
    if (cart) {
      callback(cart);
    } else {
      callback(new CartConstructor([], 0));
    }
  }

  indexOfProduct(id) {
    return this.cartStore.data.products.map(item => item.id).indexOf(id);
  }
}

module.exports = CartRepository;
