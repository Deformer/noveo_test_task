const ProductRepository = require('../repositories/product');
const Product = new ProductRepository();

exports.getAllProducts = (req, res) => {
  Product.getAll((err, results) => {
    if (err) {
      res.sendStatus(500);
      console.error(err);
    } else res.status(200).json({ data: results });
  });
};
