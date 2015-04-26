var sinon = require("sinon");
var request = require("co-request");
var torrentService = require("../../../app/server/services/torrentService");

describe("downloadApi", function () {

  describe("should validate query params", function () {

    it("should parse correct data", function* (cb) {
      sinon.stub(torrentService, "start", function* (id) {
        console.log("torrent service start");
        expect(id).to.eql(123);
        cb();
      });
      yield apiRequest("downloads/123/start");
    });

    it("should fail with not numeric string", function* () {
      var url = "http://localhost:3000/api/downloads/aa/start";
      var response = yield request.get(url, {json: true});
      expect(response.statusCode).to.equal(400);
      expect(response.body).to.eql({
        "errors": [
          {
            "code": "VALIDATION",
            "message": "id must be a number",
            "path": "id"
          }
        ]
      });
    });

    it("should fail with id smaller than 0", function* () {
      var url = "http://localhost:3000/api/downloads/-3/start";
      var response = yield request.get(url, {json: true});
      expect(response.statusCode).to.equal(400);
      expect(response.body).to.eql({
        "errors": [
          {
            "code": "VALIDATION",
            "message": "id must be larger than or equal to 0",
            "path": "id"
          }
        ]
      });
    });

  });

});

function* apiRequest(path, query) {
  var url = "http://localhost:3000/api/" + path;
  var response = yield request.get(url, {json: true});
  expect(response.statusCode).to.equal(200);
  return response.body;
}