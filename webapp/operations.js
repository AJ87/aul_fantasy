//CRUD operations
var database = require('./database.js');

var responder = function(result, res, status_ok, send_res, status_err, err_text) {
  if (result) {
    if (send_res) {
      res.status(status_ok).send(result);
    } else {
      res.status(status_ok).send();
    }
  } else {
    res.status(status_err).send(err_text);
  }
}

var tryCatch = function(operation, res) {
  try {
    operation();
  } catch (e) {
    console.log(e);
    res.status(500).send("Error");
  }
}

module.exports = {
  getCollection: function(db_table, res) {

    var operation = function() {
      database.getCollection(db_table, function(result) {
        responder(result, res, 200, true, 404, "Not Found");
      });
    }
    tryCatch(operation, res);
  },
  getRecord: function(key, db_table, res) {

    var operation = function() {
      database.getRecord(key, db_table, function(result) {
        responder(result, res, 200, true, 404, "Not Found");
      });
    }
    tryCatch(operation, res);
  },
  createRecord: function(key, data, db_table, res) {

    var operation = function() {
      database.createRecord(key, data, db_table, function(result) {
        responder(result, res, 201, true, 409, "Duplicate key");
      });
    }
    tryCatch(operation, res);
  },
  updateRecord: function(key, data, db_table, res) {

    var operation = function() {
      database.updateRecord(key, data, db_table, function(result) {
        responder(result, res, 204, false, 404, "Not Found");
      });
    }
    tryCatch(operation, res);
  },
  deleteRecord: function(key, db_table, res) {

    var operation = function() {
      database.deleteRecord(key, db_table, function(result) {
        responder(result, res, 204, false, 404, "Not Found");
      });
    }
    tryCatch(operation, res);
  }
};
