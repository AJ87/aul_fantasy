
var _db;
var _log;

function setDB(db) {
  _db = db
}

function setLogger(log) {
  _log = log;
}

var abstract = {
  setDB: setDB,
  setLogger: setLogger
};

module.exports = abstract;
