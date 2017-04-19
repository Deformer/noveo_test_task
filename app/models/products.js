/**
 * Created by sergey on 02.03.2017.
 */
const mongoose = require('../db');
const Counter = require('./counters');

const productSchema = new mongoose.Schema({
  _id: {
    type: Number,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
});

productSchema.pre('save', function (next) {
  const doc = this;
  Counter.findByIdAndUpdate({ _id: 'productId' }, { $inc: { seq: 1 } }, (error, counter) => {
    if (error) { return next(error); }
    doc._id = counter.seq;
    next();
  });
});

// exports.getAllProducts = (cb) => {
//   assert.equal(typeof (cb), 'function',
//         'callback should be a function');
//   const collection = db.get().collection('products');
//   collection.find().toArray(cb);
// };
//
// exports.getProductById = (product_Id, cb) => {
//   assert.equal(typeof (cb), 'function',
//         'callback should be a function');
//   const collection = db.get().collection('products');
//   collection.findOne({ _id: product_Id }, cb);
// };
module.exports = mongoose.model('Product', productSchema);
