var MongoClient = require('mongodb').MongoClient;

// Connection URL
var url = 'mongodb://localhost:27017/fantasy';
var _db = null;
var log;

function _close_db() {
   log.info("Closing database");
   if (_db) {
     _db.close();
     _db = null;
   }
}

function _insertDocument(data, table) {
  return new Promise( function pr(resolve,reject) {
    log.debug("Insert Document");
    var _collection = _db.collection(table);
    _collection.insertOne(data, function(err, result) {
      if (err) {
        log.error("Error inserting document: " + data);
        //throw err;
        reject(err);
      } else {
        resolve(result.ops);
      }
    });
  });
}

function _findDocument(key, table) {
  return new Promise( function pr(resolve,reject) {
    log.debug("Find Document");
    var _collection = _db.collection(table);
    _collection.find(key).toArray(function(err, docs) {
      if (err) {
        log.error("Error finding document: " + data);
        //throw err;
        reject(err);
      } else {
        resolve(docs);
      }
    });
  });
}

function _deleteDocument(key, table) {
  return new Promise( function pr(resolve,reject) {
    log.debug("Delete Document");
    var _collection = _db.collection(table);
    _collection.deleteOne(key, function(err, result) {
      if (err) {
        log.error("Error deleting document: " + data);
        //throw err;
        reject(err);
      } else {
        resolve(result.result.n);
      }
    });
  });
}

function _connect() {
  return new Promise( function pr(resolve,reject) {
    log.info("Connecting to database...");
    // Use connect method to connect to the database

    MongoClient.connect(url, function(err, db) {
      if (err === null) {
        log.info('Connected successfully to database');
        _db = db;
        resolve();
      } else {
        log.error('Error connecting to database');
        reject(err);
      }
    });
  });
};

function getCollection(key,table) {
    log.debug("Get Collection");
    log.debug(`get collection: ${table}`);
    return _findDocument(key, table);
}

function getRecord(key, table) {
  return new Promise( function pr(resolve,reject) {
    log.debug("Get Record");
    _findDocument(key, table)
    .then(
      function fullfilled(result) {
        if (result[0]) {
          resolve(result[0]);
        } else {
          reject("No record");
        };
      },
      function rejected(reason) {
        reject(reason);
      }
    );
  });
}

function createRecord(key, data, table) {
  return new Promise( function pr(resolve,reject) {
    log.debug("Create Record");
    getRecord(key, table)
    .then(
      function fullfilled(result) {
        log.warn("Record already exists with same key");
        reject("Record already exists with same key");
      },
      function rejected(reason) {
        _insertDocument(data, table)
        .then(
          function fullfilled(result) {
            resolve(result);
          },
          function rejected(reason) {
            reject(reason);
          }
        );
      }
    );
  });
}

function updateRecord(key, data, table) {
  return new Promise( function pr(resolve,reject) {
    log.debug("Update Record");
    deleteRecord(key, table)
    .then(
      function fullfilled(result) {
        _insertDocument(data, table)
        .then(
          function fullfilled(result) {
            resolve(result);
          },
          function rejected(reason) {
            reject(reason);
          }
        );
      },
      function rejected(reason) {
        reject(reason);
      }
    );
  });
}

function deleteRecord(key, table) {
  return new Promise( function pr(resolve,reject) {
    log.debug("Delete Record");
    _deleteDocument(key, table)
    .then(
      function fullfilled(result) {
        resolve(result);
      },
      function rejected(reason) {
        reject(reason);
      }
    );
  });
}

function initialise(log) {
  log = log;
  return _connect();
}

function close() {
  _close_db;
}

var database = {
  initialise: initialise,
  getCollection: getCollection,
  getRecord: getRecord,
  createRecord: createRecord,
  updateRecord: updateRecord,
  deleteRecord: deleteRecord,
  close: close
};

module.exports = database;
