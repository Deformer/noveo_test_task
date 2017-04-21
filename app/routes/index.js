/**
 * Created by sergey on 02.03.2017.
 */
const router = require('express').Router();
const { validateParams } = require('../middlewares/validatorParams');
const { validateBody } = require('../middlewares/validateBody');
const ProductRepository = require('../repositories/product');
const { CartService } = require('../services/cart');
const { ParamsError } = require('../helpers/errors');

const Product = new ProductRepository();

router.get('/products', (req, res) => {
  Product.getAll((err, results) => {
    if (err) {
      res.sendStatus(500);
      console.error(err);
    } else res.status(200).json({ data: results });
  });
});

router.post('/cart', validateBody, (req, res) => {
  const product_id = req.body.product_id;
  const quantity = req.body.quantity;
  const cart = new CartService(req.session);
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
    }
    cart.addProduct(product, quantity, () => {
      res.sendStatus(200);
    });
  });
});

router.delete('/cart/:product_id', validateParams, (req, res) => {
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
    const cart = new CartService(req.session);
    cart.removeProduct(product, (error) => {
      if (error) {
        res.send(error).status(404);
      } else res.sendStatus(200);
    });
  });
});

router.get('/cart', (req, res) => {
  const cart = new CartService(req.session);
  cart.getAllProducts((data) => {
    res.json(data).status(200);
  });
});

module.exports = router;
