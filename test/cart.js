/**
 * Created by sbelan on 4/26/2017.
 */
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app/app');
const should = chai.should();
chai.use(chaiHttp);

const agent = chai.request.agent(server);
describe('Cart', () => {

  describe('/GET cart', () => {
    it('it should GET an object\'s shape as cart', (done) => {
      chai.request(server)
        .get('/api/cart')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('products');
          res.body.data.products.should.be.a('array');
          res.body.data.products.length.should.be.eql(0);
          res.body.data.should.have.property('products_count').eql(0);
          res.body.data.should.have.property('total_sum').eql(0);
          done();
        });
    });
  });

  describe('/POST cart', () => {
    beforeEach((done) => {
      agent
        .get('/api/resetCart')
        .end((err, res) => {
          done();
        });
    });
    const product = {
      product_id: 2,
      quantity: 10,
    };
    const productsWithWrongId = [
      {
        product_id: 10,
        quantity: 10,
      },
      {
        product_id: 'it\'s not an id',
        quantity: 10,
      },
    ];
    const productsWithWrongQuantity = [
      {
        product_id: 2,
        quantity: 0,
      },
      {
        product_id: 2,
        quantity: 11,
      },
    ];
    it('it should add a new product to the cart', (done) => {
      agent
        .post('/api/cart')
        .send(product)
        .end((err, res) => {
          res.should.have.status(200);
          return agent
            .get('/api/cart')
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('data');
              res.body.data.should.be.a('object');
              res.body.data.should.have.property('products');
              res.body.data.products.should.be.a('array');
              res.body.data.products.length.should.be.eql(1);
              res.body.data.should.have.property('products_count').eql(10);
              res.body.data.should.have.property('total_sum').eql(1500);
              res.body.data.products.should.have.deep.property('[0].id', 2);
              res.body.data.products.should.have.deep.property('[0].quantity', 10);
              res.body.data.products.should.have.deep.property('[0].sum', 1500);
              done();
            });
        });
    });

    productsWithWrongId.forEach((product) => {
      it('it should drop an error when you try to add a product which doesn\'t exist in database', (done) => {
        chai.request(server)
          .post('/api/cart')
          .send(product)
          .end((err, res) => {
            res.should.have.a.status(400);
            res.body.should.have.property('name').eql('ParamsError');
            res.body.should.have.property('type').eql('invalid_param_error');
            res.body.should.have.property('details').be.a('array');
            res.body.details.should.have.deep.property('[0].name').be.a('string');
            res.body.details.should.have.deep.property('[0].message').be.a('string');
            res.body.details.should.have.deep.property('[0].code').be.a('string');
            done();
          });
      });
    });

    productsWithWrongQuantity.forEach((product) => {
      it('it should drop an error when you try to add a product with wrong quantity', (done) => {
        chai.request(server)
          .post('/api/cart')
          .send(product)
          .end((err, res) => {
            res.should.have.a.status(400);
            res.body.should.have.property('name').eql('ParamsError');
            res.body.should.have.property('type').eql('invalid_param_error');
            res.body.should.have.property('details').be.a('array');
            res.body.details.should.have.deep.property('[0].name').be.a('string');
            res.body.details.should.have.deep.property('[0].message').be.a('string');
            res.body.details.should.have.deep.property('[0].code').be.a('string');
            done();
          });
      });
    });

    it('it should increase an cartStats after adding a product', (done) => {
      agent
        .post('/api/cart')
        .send(product)
        .end((err, res) => {
          res.should.have.status(200);
          return agent
            .post('/api/cart')
            .send(product)
            .end((err, res) => {
              res.should.have.status(200);
              return agent
                .get('/api/cart')
                .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('data');
                  res.body.data.should.be.a('object');
                  res.body.data.should.have.property('products');
                  res.body.data.products.should.be.a('array');
                  res.body.data.products.length.should.be.eql(1);
                  res.body.data.should.have.property('products_count').eql(20);
                  res.body.data.should.have.property('total_sum').eql(3000);
                  res.body.data.products.should.have.deep.property('[0].id', 2);
                  res.body.data.products.should.have.deep.property('[0].quantity', 20);
                  res.body.data.products.should.have.deep.property('[0].sum', 3000);
                  done();
                });
            });
        });
    });
  });
  describe('/DELETE cart', () => {
    const product = {
      product_id: 2,
      quantity: 10,
    };
    it('it should drop an error when you try to delete a product from empty cart', (done) => {
      chai.request(server)
        .delete('/api/cart/1')
        .end((err, res) => {
          res.should.have.status(400);
          res.error.should.have.property('text').eql('Корзина пуста, вы не можете удалить из нее товар');
          done();
        });
    });
    it('it should drop an error when you try to delete a product which is not exists in the database', (done) => {
      agent
        .post('/api/cart')
        .send(product)
        .end((err, res) => {
          res.should.have.status(200);
          return agent
            .delete('/api/cart/10')
            .end((err, res) => {
              res.should.have.status(400);
              res.error.should.have.property('text').eql('Такого продукта нет в системе');
              done();
            });
        });
    });
    it('it should drop an error when you try to send a request with wrong params', (done) => {
      chai.request(server)
        .delete('/api/cart/some_wrong_param')
        .end((err, res) => {
          res.should.have.a.status(400);
          res.body.should.have.property('name').eql('ParamsError');
          res.body.should.have.property('type').eql('invalid_param_error');
          res.body.should.have.property('details').be.a('array');
          res.body.details.should.have.deep.property('[0].name').be.a('string');
          res.body.details.should.have.deep.property('[0].message').be.a('string');
          res.body.details.should.have.deep.property('[0].code').be.a('string');
          done();
        });
    });
    it('it should return a 200 status code when product is deleted correctly', (done) => {
      agent
        .post('/api/cart')
        .send(product)
        .end((err, res) => {
          res.should.have.status(200);
          return agent
            .delete(`/api/cart/${product.product_id}`)
            .end((err, res) => {
              res.should.have.status(200);
              done();
            });
        });
    });
  });
});
