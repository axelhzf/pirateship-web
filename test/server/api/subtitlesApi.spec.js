var sinon = require("sinon");
var subtitlesDownlaoder = require("subtitles-downloader");
var request = require("co-request");

describe("subtitlesApi", function () {
  
  var sandbox;
  
  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    sandbox.stub(subtitlesDownlaoder, "downloadSubtitle", function (file, lang) {
      return Promise.resolve({file: file});
    });
  });
  
  afterEach(function () {
    sandbox.restore();
  });
  
  it("should call to download subtitles", function* () {
    var file = "/videos/movie1.mkv";
    yield apiRequest("subtitles", {file: file});
    expect(subtitlesDownlaoder.downloadSubtitle.callCount).to.eql(2);
    expect(subtitlesDownlaoder.downloadSubtitle.calledWithExactly(file, "eng")).to.be.true;
    expect(subtitlesDownlaoder.downloadSubtitle.calledWithExactly(file, "spa")).to.be.true;
  });
});

function* apiRequest(path, body) {
  var url = "http://localhost:3000/api/" + path;
  var response = yield request.post(url, {body: body, json: true});
  expect(response.statusCode).to.equal(200);
  return response.body;
}