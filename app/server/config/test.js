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
  }
};