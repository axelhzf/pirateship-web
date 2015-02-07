var dbUtils = require("barbakoa").test.server.utils.dbUtils;
var postProcessService = require("../../../app/server/services/postProcess");
var Recent = require("../../../app/server/models/Recent");
var sinon = require("sinon");
var subtitleDownloader = require("subtitles-downloader");
var Promise = require("bluebird");
var config = require("config");

describe("postProcessService", function () {
  
  describe("onProccesdFile", function () {
    
    var sandbox, downloadSubtitleStub;

    var filename = "Big.Bang.Theory.S01E01.mkv";
    var src = "/src/" + filename;
    var dest = "/dest/" + filename;
    
    beforeEach(function* () {
      yield dbUtils.dropTables(Recent);
      sandbox = sinon.sandbox.create();
    });
    
    afterEach(function () {
      sandbox.restore();
    });
    
    it("should create a new recent record", function* () {
      stubDownloadSubtitleOk();
      
      yield postProcessService.onProcessedFile(src, dest);
      var recents = yield Recent.findAll();
      expect(recents.length).to.eql(1);
      expect(recents[0].file).to.eql(filename);
    });
    
    it("should downloads subtitles in spanish and english", function* () {
      stubDownloadSubtitleOk();
      
      yield postProcessService.onProcessedFile(src, dest);
      expect(downloadSubtitleStub.callCount).to.eql(2);
      expect(downloadSubtitleStub.calledWithExactly(dest, "eng")).to.be.true;
      expect(downloadSubtitleStub.calledWithExactly(dest, "spa")).to.be.true;
    });
    
    it("should try to download again the subtitles if download fail", function *() {
      var attempt = 0;
      
      
      
      
      downloadSubtitleStub = sandbox.stub(subtitleDownloader, "downloadSubtitle", function (file, lang) {
        if (lang === "eng") return Promise.resolve({});
        attempt++;
        if (attempt < 3) {
          return Promise.resolve(undefined); // when the library doesn't found the subtitle returns undefined
        } else {
          return Promise.resolve({file: dest});
        }
      });
      
      yield postProcessService.onProcessedFile(src, dest);
      expect(downloadSubtitleStub.callCount).to.eql(4);
      expect(downloadSubtitleStub.calledWithExactly(dest, "eng")).to.be.true;
      expect(downloadSubtitleStub.calledWithExactly(dest, "spa")).to.be.true;
    });

    function stubDownloadSubtitleOk() {
      downloadSubtitleStub = sandbox.stub(subtitleDownloader, "downloadSubtitle", function () {
        return Promise.resolve({});
      });
    }
    
  });
});