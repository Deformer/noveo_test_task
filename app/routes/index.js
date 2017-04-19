/**
 * Created by sergey on 02.03.2017.
 */
const router = require('express').Router();
const { addProductToCart, deleteProductFromCart, getAllProductsInCart } = require('../services/cart');
const { validateBody, validateParams } = require('../middlewares/validatorParams');
const { getAllProducts } = require('../services/product');
const ProductRepository = require('../repositories/product');

router.get('/products', getAllProducts);

router.post('/cart', validateBody, addProductToCart);

router.delete('/cart/:product_id', validateParams, deleteProductFromCart);

router.get('/cart', getAllProductsInCart);

router.get('/test', (req, res) => {
  const productRepo = new ProductRepository();
  productRepo.getAll((err, result) => {
    console.log(err);
    res.send(result);
  });
});

module.exports = router;
