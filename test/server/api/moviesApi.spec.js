var sinon = require("sinon");
var request = require("co-request");
var Movie = require("../../../app/server/models/Movie");
var dbUtils = require("barbakoa").test.utils.dbUtils;
var qs = require("qs");
var torrentService = require("../../../app/server/services/torrentService");

describe("moviesApi", function () {

  beforeEach(function* () {
    yield dbUtils.dropTables(Movie);
    yield dbUtils.createFixtures({
      Movie: [
        {id: 1, imdb_id: "id1", title: "Transformers", year: 2010, genre: "Action"},
        {id: 2, imdb_id: "id2", title: "Batman", year: 2014, genre: "Sci-Fi"},
        {id: 3, imdb_id: "id3", title: "Batman2", year: 2014, genre: "Horror"}
      ]
    });
  });

  it("should list all movies", function* () {
    var movies = yield apiRequest("movies");
    expect(movies.items.length).to.equal(3);
  });

  it("should fetch a movie", function* () {
    var movie = yield apiRequest("movies/1");
    expect(movie).to.exist;
  });

  it("should search by title", function* () {
    var movies = yield apiRequest("movies", {limit: 50, offset: 0, where: ["title LIKE 'transformers%' "]});
    expect(movies.items.length).to.equal(1);
    expect(movies.items[0].title).to.eql("Transformers");
  });

  it("should return age of movies in descent order", function* () {
    var years = yield apiRequest("movies/_years");
    expect(years).to.eql([2014, 2010]);
  });

  it("should return genres of movies in ascent order", function* () {
    var years = yield apiRequest("movies/_genres");
    expect(years).to.eql(["Action", "Horror", "Sci-Fi"]);
  });

  describe("/{movieId}/torrents", function () {

    beforeEach(function () {
      sinon.stub(torrentService, "findByMovie", function () {
        return [
          {
            title: "Guardians of the Galaxy (2014) 1080p BrRip x264 - YIFY",
            link: "magnet:?xt=urn:btih:11a2ac68a11634e980f265cb1433c599d017a759&dn=Guardians+of+the+Galaxy+%282014%29+1080p+BrRip+x264+-+YIFY&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Ftracker.publicbt.com%3A80&tr=udp%3A%2F%2Ftracker.istole.it%3A6969&tr=udp%3A%2F%2Fopen.demonii.com%3A1337",
            seeds: "21889",
            leechers: "3827"
          },
          {
            title: "Guardians of the Galaxy (2014) 720p BrRip x264 - YIFY",
            link: "magnet:?xt=urn:btih:836d2e8c6350e4ce3800e812b60de53a63feb027&dn=Guardians+of+the+Galaxy+%282014%29+720p+BrRip+x264+-+YIFY&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Ftracker.publicbt.com%3A80&tr=udp%3A%2F%2Ftracker.istole.it%3A6969&tr=udp%3A%2F%2Fopen.demonii.com%3A1337",
            seeds: "10359",
            leechers: "1740"
          }
        ]
      });
    });

    //afterEach(function () {
    //torrentService.findByMovie.restore();
    //});


    it("should return movies for a torrent", function* () {
      var torrents = yield apiRequest("movies/1/torrents");
      expect(torrents.length == 2).to.be.true;
      expect(torrents[0]).to.include({title: "Guardians of the Galaxy (2014) 1080p BrRip x264 - YIFY"});
      expect(torrents[1]).to.include({title: "Guardians of the Galaxy (2014) 720p BrRip x264 - YIFY"});
    });

  });

});


function* apiRequest(path, query) {
  var url = "http://localhost:3000/api/" + path + "?" + qs.stringify(query);
  var response = yield request(url, {json: true});
  expect(response.statusCode).to.equal(200);
  return response.body;
}