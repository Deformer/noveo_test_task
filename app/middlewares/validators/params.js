/**
 * Created by sergey on 02.03.2017.
 */
const Joi = require('joi');
const { ParamsError } = require('../../helpers/errors');

const options = { abortEarly: false };

exports.validateParams = (req, res, next) => {
  const paramsSchema = Joi.object().keys({
    product_id: Joi.number().integer().required(),
  });
  Joi.validate(req.params, paramsSchema, options, (err, validParams) => {
    if (err) {
      res.status(400).send(new ParamsError(err.details));
    } else {
      req.params = validParams;
      next();
    }
  });
};
