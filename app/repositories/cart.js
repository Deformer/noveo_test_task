/**
 * Created by sbelan on 4/19/2017.
 */
const { CartConstructor } = require('../helpers/constructors');

class CartRepository {
  constructor(store) {
    this.store = store;
  }

  add(product, quantity, callback) {
    const { price, _id } = product;
    const index = this.indexOfProduct(_id);

    this.store.data.products_count += quantity;
    this.store.data.total_sum += quantity * price;
    if (index === -1) {
      this.store.data.products.push({
        id: _id,
        quantity,
        sum: quantity * price,
      });
      callback();
      return;
    }
    const currentProduct = this.store.data.products[index];
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
    const currentProduct = this.store.data.products[index];
    this.store.data.total_sum -= price;
    this.store.data.products_count -= 1;
    if (currentProduct.quantity === 1) {
      this.store.data.products.splice(index, 1);
    } else {
      currentProduct.quantity -= 1;
      currentProduct.sum -= price;
    }
    callback();
  }

  getAll(callback) {
    const cart = this.store;
    if (cart) {
      callback(cart);
    } else {
      callback(new CartConstructor());
    }
  }

  indexOfProduct(id) {
    return this.store.data.products.map(item => item.id).indexOf(id);
  }
}

module.exports = CartRepository;
