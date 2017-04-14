/**
 * Created by sergey on 02.03.2017.
 */
const db = require('../db');
const assert = require('assert');

exports.getAllProducts =  (cb) => {
    assert.equal(typeof (cb), 'function',
        "callback should be a function");
    let collection = db.get().collection('products');
    collection.find().toArray(cb);
};

exports.getProductById =  (product_Id,cb) => {
    assert.equal(typeof (cb), 'function',
        "callback should be a function");
    let collection = db.get().collection('products');
    collection.findOne({"_id": product_Id}, cb);
}