const Product = require('../models/products');

exports.getAllProducts = (req, res) => {
  Product.getAllProducts((err, results) => {
    if (err) {
      res.sendStatus(500);
      console.error(err);
    } else res.status(200).json({ data: results });
  });
};
