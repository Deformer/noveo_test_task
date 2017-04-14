/**
 * Created by sergey on 02.03.2017.
 */
exports.CartConstructor =  function (product,quantity) {
    this.data = {
        total_sum: product === null ? 0 : product.price*quantity,
            products_count: quantity,
            products: product === null ? [] : [
            {
                id:product._id,
                quantity:quantity,
                sum:product.price*quantity
            }
        ]
    }
};