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
    max_tries: Infinity,
    interval: 10,
    max_interval: 100
  },
  postProcess: {
    enable: false
  }
};