"use strict";

var Auth = require("../models/Auth");
var request = require("co-request");
var qs = require("qs");

class TraktAuth {
  constructor(router) {
    this.router = router;
  }
  
  initializeRoutes() {
    this.router.get("/auth", this._authRoute);
    this.router.get("/callback", this._callbackRoute);
  }
  
  *_authRoute() {
    var queryString = qs.stringify({
      response_type: "code",
      client_id: "f64e2679607320225850c2b25f5512d8f38a6b6b824995cc202354c9b05e64f3",
      redirect_uri: "http://localhost:3000/callback"
    });
    var url = "https://api-v2launch.trakt.tv/oauth/authorize?" + queryString;
    this.redirect(url);
  }
  
  *_callbackRoute() {
    var query = this.request.query;
    var code = query.code;
    var response = yield request({
      method: "post",
      uri: "https://api-v2launch.trakt.tv/oauth/token",
      body: {
        code: code,
        client_id: "f64e2679607320225850c2b25f5512d8f38a6b6b824995cc202354c9b05e64f3",
        client_secret: "12390b92e7874ef7b77c6570e91d5ded54ba095ad31189abca84997b62978baf",
        redirect_uri: "http://localhost:3000/callback",
        grant_type: "authorization_code"
      },
      json: true
    });
    var auth = yield Auth.instance();
    if (response.statusCode === 200) {
      yield auth.updateAttributes(response.body);
      this.body = response.body;
    } else {
      throw new Error("Authentication Error");
    }
  }
}

module.exports = TraktAuth;