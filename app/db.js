/**
 * Created by sergey on 02.03.2017.
 */
const MongoClient = require('mongodb').MongoClient;

const url = process.env.CONNECTION_STRING_DB || 'mongodb://admin:admin@ds113680.mlab.com:13680/test_task_shop';

const state = {
  db: null,
};

MongoClient.connect(url, (err, db) => {
  if (err) throw err;
  state.db = db;
});


exports.get = () => state.db;


exports.close = () => {
  if (state.db) {
    state.db.close((err, result) => {
      state.db = null;
      state.mode = null;
      console.log('db closed');
      // done(err)
    });
  }
};

process.on('SIGINT', () => {
  state.db.close(() => {
    console.log('\nMongoDB disconnected on app termination');
    process.exit(0);
  });
});
