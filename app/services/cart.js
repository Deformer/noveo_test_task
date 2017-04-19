/**
 * Created by sbelan on 4/19/2017.
 */
const ProductRepository = require('../repositories/product');
const CartRepository = require('../repositories/cart');
const { ParamsError } = require('../helpers/errors');
const { CartConstructor } = require('../helpers/constructors');
const Product = new ProductRepository();


exports.addProductToCart = (req, res) => {
  const product_id = req.body.product_id;
  const quantity = req.body.quantity;
  Product.getById(product_id, (err, [product]) => {
    if (err) {
      res.sendStatus(500);
      console.error(err);
      return;
    } if (!product) {
      res.status(400).json(new ParamsError([{
        message: "'product_id' doesn't exist in database",
        path: 'product_id',
        type: 'bad parameter',
      }]));
      return;
    } if (!req.session.cart) {
      req.session.cart = new CartConstructor(product, quantity);
      req.session.cartMaxAge = Date.now() + (5 * 60 * 1000);
      res.sendStatus(200);
      return;
    }
    const cart = new CartRepository(req.session.cart);
    cart.add(product, quantity, () => {
      res.sendStatus(200);
    });
  });
};

exports.deleteProductFromCart = (req, res) => {
  const product_id = req.params.product_id;
  if (!req.session.cart) {
    res.status(400).send('Корзина пуста, вы не можете удалить из нее товар');
    return;
  }
  Product.getById(product_id, (err, [product]) => {
    if (err) {
      res.sendStatus(500);
      console.error(err);
      return;
    } if (!product) {
      res.status(400).send('Такого продукта нет в системе');
      return;
    }
    const cart = new CartRepository(req.session.cart);
    cart.remove(product, (error) => {
      if (error) {
        res.send(error).status(404);
      } else res.sendStatus(200);
    });
  });
};

exports.getAllProductsInCart = (req, res) => {
  const cart = new CartRepository(req.session.cart);
  cart.get((data) => {
    res.json(data).status(200);
  });
};
