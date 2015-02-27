var db = require("barbakoa").db;

var Auth = db.define("Auth", {
  access_token: db.types.STRING,
  token_type: db.types.STRING,
  expires_in: db.types.INTEGER,
  refresh_token: db.types.STRING,
  scope: db.types.STRING
}, {
  classMethods: {
    instance: function* () {
      var auths = yield Auth.findAll();
      if (auths.length === 0) {
        return yield Auth.create({});
      }
      return auths[0];
    }
  }
});

module.exports = Auth;
