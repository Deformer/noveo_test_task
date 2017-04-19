/**
 * Created by sbelan on 4/19/2017.
 */

const mongoose = require('../db');

const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 10 },
});
module.exports = mongoose.model('counter', CounterSchema);
