var db = require("barbakoa").db;

module.exports = db.define("Recent", {
  file: db.types.STRING(1000)
});