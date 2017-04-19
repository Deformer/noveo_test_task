/**
 * Created by sbelan on 4/19/2017.
 */
class RepositoryBase {
  constructor(collection) {
    this.collection = collection;
  }

  create(item, callback) {
    this.collection.create(item, callback);
  }

  remove(query, callback) {
    this.collection.remove(query, callback);
  }

  update(query, value, callback) {
    this.collection.update(query, { $set: value }, callback);
  }

  getById(id, callback) {
    this.collection.find({ _id: id }, callback);
  }

  getAll(callback) {
    this.collection.find({}, callback);
  }
}

module.exports = RepositoryBase;

