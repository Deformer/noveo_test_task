/**
 * Created by sergey on 03.03.2017.
 */

const PageNotFoundError = require('../helpers/errors').PageNotFoundError;
module.exports = (req,res,next) => {
    res.status(400).json(new PageNotFoundError(req.originalUrl));
};