var moviedbService = require("../../../app/server/services/moviedbService");

describe("moviedbService", function () {
  it("should fetch movie metadata using imdbid", function* () {
    this.timeout(5000);
    var response = yield moviedbService.getMoviedbMeta("tt2267998");
    console.log(JSON.stringify(response));
  });
});