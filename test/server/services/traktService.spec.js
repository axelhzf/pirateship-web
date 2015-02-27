var traktService = require("../../../app/server/services/traktService");

describe("traktService", function () {
  describe("checkin", function () {
    
    it("should save checking to trakt api", function* () {
      yield traktService.checkin("movie", 1123);
      
    })
    
  });
});