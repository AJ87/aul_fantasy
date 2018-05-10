
var abstract = {
  setDB: function(db) {
    this._db = db;
  },
  setLogger: function(log) {
    this._log = log;
  }
};

module.exports = abstract;
