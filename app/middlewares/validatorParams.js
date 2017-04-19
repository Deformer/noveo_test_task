/**
 * Created by sergey on 02.03.2017.
 */
const Joi = require('joi'),
  ParamsError = require('../helpers/errors').ParamsError,
  options = { abortEarly: false };

exports.validateBody = (req, res, next) => {
  const bodySchema = Joi.object().keys({
    product_id: Joi.number().integer().required(),
    quantity: Joi.number().integer().min(1).max(10).required(),
  });
  Joi.validate(req.body, bodySchema, options, (err, validBody) => {
    if (err) {
      res.status(400).send(new ParamsError(err.details));
      console.error(err);
    } else {
      req.body = validBody;
      next();
    }
  });
};

exports.validateParams = (req, res, next) => {
  const paramsSchema = Joi.object().keys({
    product_id: Joi.number().integer().required(),
  });
  Joi.validate(req.params, paramsSchema, options, (err, validParams) => {
    if (err) {
      res.status(400).send(new ParamsError(err.details));
      console.error(err);
    } else {
      req.params = validParams;
      next();
    }
  });
};
