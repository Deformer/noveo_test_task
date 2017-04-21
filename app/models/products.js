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

module.exports = mongoose.model('Product', productSchema);
