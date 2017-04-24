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
      this.addNewProduct(product, quantity, callback);
      return;
    }
    this.addToExistedProduct(index, product, quantity, callback);
  }

  addNewProduct(product, quantity, callback) {
    const { price, _id } = product;
    this.store.data.products.push({
      id: _id,
      quantity,
      sum: quantity * price,
    });
    callback();
  }

  addToExistedProduct(index, product, quantity, callback) {
    const { price } = product;
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
      this.removeWholeProduct(index);
    } else {
      this.decreaseProductQuantity(index, product);
    }
    callback();
  }

  removeWholeProduct(index) {
    this.store.data.products.splice(index, 1);
  }

  decreaseProductQuantity(index, product) {
    const { price } = product;
    const currentProduct = this.store.data.products[index];
    currentProduct.quantity -= 1;
    currentProduct.sum -= price;
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
