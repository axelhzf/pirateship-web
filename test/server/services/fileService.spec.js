var sinon = require("sinon");
var tmp = require("tmp");
var Promise = require("bluebird");
var tmpDir = Promise.promisify(tmp.dir);
var fs = require("mz/fs");
var path = require("path");
var config = require("config");
var mkdirp = Promise.promisify(require("mkdirp"));
var fileService = require("../../../app/server/services/fileService");
var dbUtils = require("barbakoa").test.server.utils.dbUtils;
var Show = require("../../../app/server/models/Show");
var Episode = require("../../../app/server/models/Episode");
var _ = require("underscore");

describe("fileService", function () {

  var sandbox = sinon.sandbox.create();
  var tmpPath;

  beforeEach(function* () {
    tmpPath = (yield tmpDir())[0];
    var configStub = sandbox.stub(config, "get");
    configStub.withArgs("postProcess.destinationFolder").returns(tmpPath);
    
    yield dbUtils.dropTables(Episode, Show);
  });

  afterEach(function () {
    sandbox.restore();
  });

  it("should return file and subtitles", function* () {
    var show = yield Show.create({
      title: "The Flash 2014"
    });
    var episode = yield Episode.create({
      season: 1,
      number: 1
    });
    yield episode.setShow(show);
    
    var baseDir = path.join(tmpPath, "tvshows", "The.Flash.2014");
    yield mkdirp(baseDir);
    var expectedResult = {
      video: path.join(baseDir, "The.Flash.2014.S01E01.720p.HDTV.X264-DIMENSION.mkv"),
      subtitles: {
        spa: path.join(baseDir, "the.flash.2014.s01E01.720p.HDTV.X264-DIMENSION.spa.srt"),
        eng: path.join(baseDir, "The.Flash.2014.S01E01.720p.HDTV.X264-DIMENSION.eng.srt"),
        default: path.join(baseDir, "The.Flash.2014.S01E01.720p.HDTV.X264-DIMENSION.srt")
      }
    };
    yield fs.writeFile(expectedResult.video, "");
    yield fs.writeFile(expectedResult.subtitles.spa, "");
    yield fs.writeFile(expectedResult.subtitles.eng, "");
    yield fs.writeFile(expectedResult.subtitles.default, "");

    var findResult = yield fileService.find("the.Flash.2014.S01E01");

    expect(_.pick(findResult, "video", "subtitles")).to.eql(expectedResult);
    expect(findResult.show).to.include({title: "The Flash 2014"});
    expect(findResult.show.episode).to.include({season: 1, number: 1});
  });

});