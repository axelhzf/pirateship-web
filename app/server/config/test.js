var path = require("path");

module.exports = {
  db: {
    database: "pirateship-test",
    sync: true,
    forceSync: true
  },
  assets: {
    reload: false
  },
  logs: {
    request: true
  },
  retry: {
    retries: 10,
    factor: 2,
    minTimeout: 1,
    maxTimeout: 2,
    randomize: false
  }
};