var config = require("config");
var apikey = config.get("trakt.apikey");
var Show = require("../models/Show");
var Episode = require("../models/Episode");
var logger = require("barbakoa").logger.child({component: "tvshowsService"});
var request = require("./request");

exports.trendingShows = function *trendingShows() {
  logger.debug("Fetching trending tvshows");
  var trendingResponse = yield request.get("http://api.trakt.tv/shows/trending.json/" + apikey);
  logger.debug("Fetched %d shows", trendingResponse.length);

  for (var i = 0; i < trendingResponse.length; i++) {
    var showData = trendingResponse[i];

    showData.image_poster = showData.images.poster;
    showData.image_poster_thumb = thumb(showData.images.poster);
    showData.image_fanart = showData.images.fanart;
    showData.image_fanart_thumb = thumb(showData.images.fanart);
    showData.image_banner = showData.images.fanart;
    showData.image_banner_thumb = thumb(showData.images.banner);
    showData.rating = showData.ratings.percentage;
    
    var show = yield Show.findOne({where: {imdb_id: showData.imdb_id}});
    if (show) {
      yield show.updateAttributes(showData);
    } else {
      show = yield Show.create(showData);
    }


    logger.debug("Fetching seasons from %s", show.title);
    var seasons = yield request.get("http://api.trakt.tv/show/seasons.json/" + apikey + "/" + show.imdb_id);
    logger.debug("Fetched %d seasons from %s", seasons.length, show.title);

    for (var j = 0; j < seasons.length; j++) {
      var season = seasons[j];
      logger.debug("Fetching episodes episodes from %s season %d", show.title, season.season);
      var episodesData = yield request.get("http://api.trakt.tv/show/season.json/" + apikey + "/" + show.imdb_id + "/" + season.season);
      logger.debug("Fetched episodes %d episodes from %s season %d", episodesData.length, show.title, season.season);

      for (var k = 0; k < episodesData.length; k++) {
        var episodeData = episodesData[k];
        episodeData.first_aired = new Date(episodeData.first_aired_iso);
        episodeData.image_screen = episodeData.images.screen;
        episodeData.image_screen_thumb = thumb(episodeData.images.screen);
        
        var episode = yield Episode.findOne({
          where: {
            ShowId: show.id,
            season: episodeData.season,
            number: episodeData.number
          }
        });
        if (episode) {
          yield episode.updateAttributes(episodeData)
        } else {
          episode = yield Episode.create(episodeData);
          yield episode.setShow(show);
        }
      }
    }
  }

  logger.debug("Done fetching episodes");
  return trendingResponse.length;
};

function thumb(url) {
  if (url) {
    return url.replace(/original/, "thumb");
  }
}

