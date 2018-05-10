var bunyan = require('bunyan');

var log;
var logName;

function initialise(logName) {
  logName = logName;
  log = bunyan.createLogger({
    name: logName,
    streams: [
      {
        level: 'info',
        stream: process.stdout            // log INFO and above to stdout
      },
      {
        level: 'error',
        path: `/var/tmp/${logName}-error.log`  // log ERROR and above to a file
      }
    ],
    serializers: bunyan.stdSerializers
  });
}

function get() {
  return log;
}

var logger = {
  initialise: initialise,
  get: get
};

module.exports = logger;
