/**
 * Created by sergey on 02.03.2017.
 */
exports.CartConstructor = function (product, quantity) {
  this.data = {
    total_sum: !product ? 0 : product.price * quantity,
    products_count: !quantity ? 0 : quantity,
    products: !product ? [] : [
      {
        id: product._id,
        quantity,
        sum: product.price * quantity,
      },
    ],
  };
};
