var sinon = require("sinon");
var tmp = require("tmp");
var Promise = require("bluebird");
var tmpDir = Promise.promisify(tmp.dir);
var fs = require("mz/fs");
var path = require("path");
var config = require("config");
var mkdirp = Promise.promisify(require("mkdirp"));

var fileService = require("../../../app/server/services/fileService");

describe("fileService", function () {

  var sandbox = sinon.sandbox.create();
  var tmpPath;

  beforeEach(function* () {
    tmpPath = (yield tmpDir())[0];
    var configStub = sandbox.stub(config, "get");
    configStub.withArgs("postProcess.destinationFolder").returns(tmpPath);
  });

  afterEach(function () {
    sandbox.restore();
  });

  it("should return file and subtitles", function* () {
    var baseDir = path.join(tmpPath, "tvshows", "The.Flash.2014");
    yield mkdirp(baseDir);
    var expectedResult = {
      video: path.join(baseDir, "The.Flash.2014.S01E01.720p.HDTV.X264-DIMENSION.mkv"),
      subtitles: {
        spa: path.join(baseDir, "the.flash.2014.s01E01.720p.HDTV.X264-DIMENSION.spa.srt"),
        eng: path.join(baseDir, "The.Flash.2014.S01E01.720p.HDTV.X264-DIMENSION.eng.srt")
      }
    };
    yield fs.writeFile(expectedResult.video, "");
    yield fs.writeFile(expectedResult.subtitles.spa, "");
    yield fs.writeFile(expectedResult.subtitles.eng, "");

    var findResult = yield fileService.find("the.Flash.2014.S01E01");

    expect(findResult).to.eql(expectedResult);
  });

});