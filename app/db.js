/**
 * Created by sergey on 02.03.2017.
 */
const mongoose = require('mongoose');

mongoose.connect(process.env.CONNECTION_STRING_DB || 'mongodb://admin:admin@ds113680.mlab.com:13680/test_task_shop');
module.exports = mongoose;
