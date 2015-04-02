var db = require("barbakoa").db;

module.exports = db.define("Notification", {
  deviceToken: db.types.STRING
});