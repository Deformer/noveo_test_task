/**
 * Created by sergey on 02.03.2017.
 */
const router = require('express').Router(),
    Product = require('../models/products'),
    ParamsError = require('../helpers/errors').ParamsError,
    CartConstructor = require('../helpers/constructors').CartConstructor,
    validateBody = require('../middlewares/validatorParams').validateBody,
    validateParams = require('../middlewares/validatorParams').validateParams;

router.get('/products',(req,res) => {
    Product.getAllProducts((err,results) => {
        if(err) {
            res.sendStatus(500)
            console.error(err);
        } else res.status(200).json({ data:results });
    })
});

router.post('/cart', validateBody, (req,res) => {
   let product_id = req.body.product_id,
       quantity = req.body.quantity;
   Product.getProductById(product_id, (err,productObj) => {
       if(err) {
           res.sendStatus(500);
           console.error(err);
       }else if(!productObj){
           res.status(400).json(new ParamsError( [{ message: "'product_id' doesn't exist in database", path:'product_id', type:"bad parameter" }] ));
       } else{
            if(!req.session.cart){
                req.session.cart =  new CartConstructor(productObj,quantity);
                req.session.cartMaxAge = Date.now() + 5*60*1000;
                res.sendStatus(200);
            } else{
                let cart = req.session.cart,
                    index = cart.data.products.map((item) => item.id).indexOf(product_id);
                if(index === -1){
                    cart.data.products.push( { id: productObj._id, quantity, sum: quantity* productObj.price } )
                    cart.data.products_count += quantity;
                    cart.data.total_sum += quantity* productObj.price;
                    res.sendStatus(200);
                } else {
                    let currentProduct = cart.data.products[index];
                    currentProduct.quantity += quantity;
                    currentProduct.sum += quantity*productObj.price;
                    cart.data.products_count += quantity;
                    cart.data.total_sum += quantity* productObj.price;
                    res.sendStatus(200);
                }
            }
       }
   });
});

router.delete('/cart/:product_id',validateParams,(req,res) => {
   let product_id = req.params.product_id;
   if(req.session.cart) {
       Product.getProductById(product_id,(err, productObj) => {
           if (err) {
               res.sendStatus(500);
               console.error(err);
           } else if (!productObj) {
               res.status(400).send("Такого продукта нет в системе")
           } else {
               let cart = req.session.cart,
                   index = cart.data.products.map((item) => item.id).indexOf(product_id);
               if(index === -1){
                   res.status(400).send("В вашей корзине нет такого товара")
               } else{
                   let currentProduct = cart.data.products[index];
                   cart.data.total_sum -= productObj.price;
                   cart.data.products_count--;
                   if(currentProduct.quantity === 1){
                       cart.data.products.splice(index,1)
                   }else{
                       currentProduct.quantity--;
                       currentProduct.sum -= productObj.price;
                   }
                   res.sendStatus(200);
               }
           }
       })
   } else {
       res.status(400).send("Корзина пуста, вы не можете удалить из нее товар")
   }
});

router.get('/cart',(req,res) => {
   let cart = req.session.cart;
   if(cart){
       res.status(200).json(cart);
   } else{
       res.status(200).json(new CartConstructor(null,0) );
   }
});

module.exports = router;