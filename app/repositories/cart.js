/**
 * Created by sbelan on 4/19/2017.
 */
class CartRepository {
  constructor(store) {
    this.store = store;
  }

  remove(id, callback) {
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

  getAll(callback) {
    const cart = this.store;
    callback(cart);
  }

  updateCartStats(productsCount, totalSum, callback) {
    this.store.data.products_count += productsCount;
    this.store.data.total_sum += totalSum;
    callback();
  }

  indexOfProduct(id) {
    return this.store.data.products.map(item => item.id).indexOf(id);
  }

}

module.exports = CartRepository;
