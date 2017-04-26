/**
 * Created by sergey on 02.03.2017.
 */
const router = require('express').Router();
const { validateParams } = require('../middlewares/validators/params');
const { validateBody } = require('../middlewares/validators/body');
const ProductRepository = require('../repositories/product');
const { makeCart } = require('../factories/cartFactory');
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
  const cart = makeCart(req.session);
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
  const cart = makeCart(req.session);
  cart.isEmpty((isEmpty) => {
    if (isEmpty) {
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
      cart.removeProduct(product, (error) => {
        if (error) {
          res.send(error).status(404);
        } else res.sendStatus(200);
      });
    });
  });
});

router.get('/cart', (req, res) => {
  const cart = makeCart(req.session);
  cart.getAllProducts((data) => {
    res.json(data).status(200);
  });
});

router.get('/resetCart', (req, res) => {
  delete req.session.cart;
  delete req.session.cartMaxAge;
  res.sendStatus(200);
});

module.exports = router;
