var request = require("co-request");
var log = require("barbakoa").logger.child({component: "test"});

describe("logsApi", function () {
  
  it("should return the logs", function* () {
    var logs = yield apiRequest("logs");
    expect(logs.length > 0).to.be.true;
    expect(logs[0]).to.include.keys("time", "msg");
  });
  
});

function* apiRequest(path, query) {
  var url = "http://localhost:3000/api/" + path;
  var response = yield request.get(url, {json: true});
  expect(response.statusCode).to.equal(200);
  return response.body;
}