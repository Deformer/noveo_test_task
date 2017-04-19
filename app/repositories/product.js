/**
 * Created by sbelan on 4/19/2017.
 */
const Products = require('../models/products');
const RepositoryBase = require('./repositoryBase');

class ProductRepository extends RepositoryBase {

  constructor(){
    super(Products);
  }
}

module.exports = ProductRepository;
