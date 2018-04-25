var MongoClient = require('mongodb').MongoClient;

// Connection URL
var url = 'mongodb://localhost:27017/fantasy';
var _db = null;

function _close_db() {
   console.log("Closing database");
   if (_db) {
     _db.close();
     _db = null;
   }
}

function _insertDocument(data, table) {
  return new Promise( function pr(resolve,reject) {
    console.log("Insert Document");
    var _collection = _db.collection(table);
    _collection.insertOne(data, function(err, result) {
      if (err) {
        console.log("Error inserting document: " + data);
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
    console.log("Find Document");
    var _collection = _db.collection(table);
    _collection.find(key).toArray(function(err, docs) {
      if (err) {
        console.log("Error finding document: " + data);
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
    console.log("Delete Document");
    var _collection = _db.collection(table);
    _collection.deleteOne(key, function(err, result) {
      if (err) {
        console.log("Error deleting document: " + data);
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
    console.log("Connecting to database...");
    // Use connect method to connect to the database

    MongoClient.connect(url, function(err, db) {
      if (err === null) {
        console.log('Connected successfully to database');
        _db = db;
        resolve();
      } else {
        console.log('Error connecting to database');
        reject(err);
      }
    });
  });
};

function getCollection(key,table) {
    console.log("Get Collection");
    console.log(`get collection: ${table}`);
    return _findDocument(key, table);
}

function getRecord(key, table) {
  return new Promise( function pr(resolve,reject) {
    console.log("Get Record");
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
    console.log("Create Record");
    getRecord(key, table)
    .then(
      function fullfilled(result) {
        console.log("Record already exists with same key");
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
    console.log("Update Record");
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
    console.log("Delete Record");
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

function initialise() {
  return _connect();
}

var database = {
  initialise: initialise,
  getCollection: getCollection,
  getRecord: getRecord,
  createRecord: createRecord,
  updateRecord: updateRecord,
  deleteRecord: deleteRecord
};

module.exports = database;
