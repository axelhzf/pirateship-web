var Download = require("../../../app/server/models/Download");
var dbUtils = require("barbakoa").test.utils.dbUtils;

describe("Download", function () {

  describe("createFromMagnet", function () {

    it("should create from a movie", function* () {
      dbUtils.dropTables(Download);

      var movieId = 1;
      var magnet = "magnet:?xt=urn:btih:81a8169959128f4e6ff18e7aef36e9a3a49604fc&dn=The.Big.Bang.Theory.S08E06.720p.WEB-DL.x264.AAC&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Ftracker.publicbt.com%3A80&tr=udp%3A%2F%2Ftracker.istole.it%3A6969&tr=udp%3A%2F%2Fopen.demonii.com%3A1337";
      var download  = yield Download.createFromMovie(movieId, magnet);
      expect(download.hash).to.eql("81a8169959128f4e6ff18e7aef36e9a3a49604fc");
      expect(download.movie_id).to.eql(movieId);
    });

  });

});