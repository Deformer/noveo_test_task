/**
 * Created by sbelan on 4/19/2017.
 */
const { CartConstructor } = require('../helpers/constructors');

class CartRepository {
  constructor(store) {
    this.store = store;
  }

  __remove(id, callback) {
    const index = this.indexOfProduct(id);
    this.store.data.products.splice(index, 1);
    callback();
  }

  create(product, quantity, callback) {
    const { price, _id } = product;
    this.store.data.products.push({
      id: _id,
      quantity,
      sum: quantity * price,
    });
    callback();
  }

  update(id, newProduct, callback) {
    const index = this.indexOfProduct(id);
    this.store.data.products[index] = newProduct;
    callback();
  }
  get(id, callback) {
    const index = this.indexOfProduct(id);
    callback(this.store.data.products[index]);
  }

  __getAll(callback) {
    const cart = this.store;
    callback(cart);
  }

  add(product, quantity, callback) {
    const { price, _id } = product;
    const index = this.indexOfProduct(_id);

    this.store.data.products_count += quantity;
    this.store.data.total_sum += quantity * price;
    if (index === -1) {
      this.create(product, quantity, callback);
      return;
    }
    this.addToExistedProduct(_id, product, quantity, callback);
  }

  addToExistedProduct(id, product, quantity, callback) {
    const { price } = product;
    this.get(id, (result) => {
      const currentProduct = result;
      currentProduct.quantity += quantity;
      currentProduct.sum += quantity * price;
      this.update(id, currentProduct, callback);
    });
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
      this.__remove(_id, () => {});
    } else {
      this.decreaseProductQuantity(_id, product);
    }
    callback();
  }

  decreaseProductQuantity(id, product) {
    const { price } = product;
    this.get(id, (result) => {
      const currentProduct = result;
      currentProduct.quantity -= 1;
      currentProduct.sum -= price;
      this.update(id, currentProduct, callback);
    });
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
