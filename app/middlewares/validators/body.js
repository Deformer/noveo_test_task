/**
 * Created by sbelan on 4/21/2017.
 */
const Joi = require('joi');
const { ParamsError } = require('../../helpers/errors');

const options = { abortEarly: false };

exports.validateBody = (req, res, next) => {
  const bodySchema = Joi.object().keys({
    product_id: Joi.number().integer().required(),
    quantity: Joi.number().integer().min(1).max(10).required(),
  });
  Joi.validate(req.body, bodySchema, options, (err, validBody) => {
    if (err) {
      res.status(400).send(new ParamsError(err.details));
    } else {
      req.body = validBody;
      next();
    }
  });
};
