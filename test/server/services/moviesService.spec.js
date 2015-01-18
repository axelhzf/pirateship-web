var co = require("co");
var moviesService = require("../../../app/server/services/moviesService");
var dbUtils = require("barbakoa").test.server.utils.dbUtils;
var Movie = require("../../../app/server/models/Movie");
var request = require("../../../app/server/services/request");
var sinon = require("sinon");
var queue = require("../../../app/server/queue");
var Promise = require("bluebird");
var imageService = require("../../../app/server/services/imageService");


describe("MoviesService", function () {

  it("should download the featured movies", function* () {
    yield dbUtils.dropTables(Movie);

    moviesService.numberOfSetsToDownload = 1;

    sinon.stub(request, "get", function (url) {
      return new Promise(function (resolve, reject) {
        if (stubResponses[url]) {
          resolve(stubResponses[url]);
        } else {
          throw new Error("Unexpected request " + url);
        }
      });
    });
    sinon.stub(imageService, "downloadImagesForMovie");

    moviesService.setLimit = 2;

    var stats = yield moviesService.fetchFeatured();

    expect(stats).to.eql({
      totalMoviesAdded: 3
    });

    yield waitForJobsComplete();

    var movies = yield Movie.findAll().map(function (movie) {
      return movie.toJSON();
    });

    expect(movies[0]).to.include({
      imdb_id: 'tt2015381',
      title: 'Guardians of the Galaxy',
      year: 2014,
      yts_magnet: 'magnet:?xt=urn:btih:11a2ac68a11634e980f265cb1433c599d017a759&dn=Guardians+of+the+Galaxy&tr=http://exodus.desync.com:6969/announce&tr=udp://tracker.openbittorrent.com:80/announce&tr=udp://open.demonii.com:1337/announce&tr=udp://exodus.desync.com:6969/announce&tr=udp://tracker.yify-torrents.com/announce',
      trailer: 'http://youtube.com/watch?v=XT4CLuTbI7A',
      overview: 'Light years from Earth, 26 years after being abducted, Peter Quill finds himself the prime target of a manhunt after discovering an orb wanted by Ronan the Accuser.',
      poster: 'http://slurm.trakt.us/images/posters_movies/203046.2.jpg',
      rating: 8.5,
      genre: "Action",
      background: "http://slurm.trakt.us/images/fanart_movies/203046.2.jpg"
    });
    expect(movies[1]).to.include({
      imdb_id: 'tt2397535',
      title: 'Predestination',
      year: 2014,
      yts_magnet: 'magnet:?xt=urn:btih:a2a76633d94de3fbe65be506c45f4a8d9673473c&dn=Predestination&tr=http://exodus.desync.com:6969/announce&tr=udp://tracker.openbittorrent.com:80/announce&tr=udp://open.demonii.com:1337/announce&tr=udp://exodus.desync.com:6969/announce&tr=udp://tracker.yify-torrents.com/announce',
      trailer: 'http://youtube.com/watch?v=UVOpfpYijHA',
      overview: 'On his final assignment, a time-travelling Temporal Agent must pursue the one criminal who has eluded him throughout time.',
      poster: 'http://slurm.trakt.us/images/posters_movies/225720.2.jpg',
      rating: 7.5,
      genre: "Sci-Fi",
      background: "http://slurm.trakt.us/images/fanart_movies/225720.2.jpg"
    });

    request.get.restore();
    imageService.downloadImagesForMovie.restore();
  });

});


function waitForJobsComplete() {
  return new Promise(function (resolve) {
    queue.on("done", resolve);
  });
}

var stubResponses = {
  "https://yts.re/api/list.json?sort=seeds&limit=2&set=1": {
    MovieCount: 5966,
    MovieList: [
      {
        MovieID: "6348",
        State: "OK",
        MovieUrl: "https://yts.re/movie/Guardians_of_the_Galaxy_2014_1080p",
        MovieTitle: "Guardians of the Galaxy (2014) 1080p",
        MovieTitleClean: "Guardians of the Galaxy",
        MovieYear: "2014",
        AgeRating: "PG-13",
        DateUploaded: "2014-11-16 11:58:39",
        DateUploadedEpoch: 1416092319,
        Quality: "1080p",
        CoverImage: "https://static.yts.re/attachments/Guardians_of_the_Galaxy_2014_1080p/poster_med.jpg",
        ImdbCode: "tt2015381",
        ImdbLink: "http://www.imdb.com/title/tt2015381/",
        Size: "1.85 GB",
        SizeByte: "1988828715",
        MovieRating: "8.5",
        Genre: "Action",
        Uploader: "OTTO",
        UploaderUID: "310615",
        Downloaded: "482467",
        TorrentSeeds: "27391",
        TorrentPeers: "6143",
        TorrentUrl: "https://yts.re/download/start/11A2AC68A11634E980F265CB1433C599D017A759.torrent",
        TorrentHash: "11a2ac68a11634e980f265cb1433c599d017a759",
        TorrentMagnetUrl: "magnet:?xt=urn:btih:11a2ac68a11634e980f265cb1433c599d017a759&dn=Guardians+of+the+Galaxy&tr=http://exodus.desync.com:6969/announce&tr=udp://tracker.openbittorrent.com:80/announce&tr=udp://open.demonii.com:1337/announce&tr=udp://exodus.desync.com:6969/announce&tr=udp://tracker.yify-torrents.com/announce"
      },
      {
        MovieID: "6417",
        State: "OK",
        MovieUrl: "https://yts.re/movie/Predestination_2014",
        MovieTitle: "Predestination (2014)",
        MovieTitleClean: "Predestination",
        MovieYear: "2014",
        AgeRating: "R",
        DateUploaded: "2014-11-24 22:54:13",
        DateUploadedEpoch: 1416822853,
        Quality: "720p",
        CoverImage: "https://static.yts.re/attachments/Predestination_2014/poster_med.jpg",
        ImdbCode: "tt2397535",
        ImdbLink: "http://www.imdb.com/title/tt2397535/",
        Size: "757.22 MB",
        SizeByte: "794004613",
        MovieRating: "7.5",
        Genre: "Sci-Fi",
        Uploader: "OTTO",
        UploaderUID: "310615",
        Downloaded: "227745",
        TorrentSeeds: "24127",
        TorrentPeers: "7743",
        TorrentUrl: "https://yts.re/download/start/A2A76633D94DE3FBE65BE506C45F4A8D9673473C.torrent",
        TorrentHash: "a2a76633d94de3fbe65be506c45f4a8d9673473c",
        TorrentMagnetUrl: "magnet:?xt=urn:btih:a2a76633d94de3fbe65be506c45f4a8d9673473c&dn=Predestination&tr=http://exodus.desync.com:6969/announce&tr=udp://tracker.openbittorrent.com:80/announce&tr=udp://open.demonii.com:1337/announce&tr=udp://exodus.desync.com:6969/announce&tr=udp://tracker.yify-torrents.com/announce"
      }
    ]
  },
  "https://yts.re/api/list.json?sort=seeds&limit=2&set=2": {
    MovieCount: 5966,
    MovieList: [
      {
        MovieID: "6348",
        State: "OK",
        MovieUrl: "https://yts.re/movie/Guardians_of_the_Galaxy_2014_1080p",
        MovieTitle: "Guardians of the Galaxy (2014) 1080p",
        MovieTitleClean: "Guardians of the Galaxy",
        MovieYear: "2014",
        AgeRating: "PG-13",
        DateUploaded: "2014-11-16 11:58:39",
        DateUploadedEpoch: 1416092319,
        Quality: "1080p",
        CoverImage: "https://static.yts.re/attachments/Guardians_of_the_Galaxy_2014_1080p/poster_med.jpg",
        ImdbCode: "tt2015381",
        ImdbLink: "http://www.imdb.com/title/tt2015381/",
        Size: "1.85 GB",
        SizeByte: "1988828715",
        MovieRating: "8.5",
        Genre: "Action",
        Uploader: "OTTO",
        UploaderUID: "310615",
        Downloaded: "482467",
        TorrentSeeds: "27391",
        TorrentPeers: "6143",
        TorrentUrl: "https://yts.re/download/start/11A2AC68A11634E980F265CB1433C599D017A759.torrent",
        TorrentHash: "11a2ac68a11634e980f265cb1433c599d017a759",
        TorrentMagnetUrl: "magnet:?xt=urn:btih:11a2ac68a11634e980f265cb1433c599d017a759&dn=Guardians+of+the+Galaxy&tr=http://exodus.desync.com:6969/announce&tr=udp://tracker.openbittorrent.com:80/announce&tr=udp://open.demonii.com:1337/announce&tr=udp://exodus.desync.com:6969/announce&tr=udp://tracker.yify-torrents.com/announce"
      }
    ]
  },
  "https://yts.re/api/list.json?sort=seeds&limit=2&set=3": {
    status: "fail"
  },
  "http://api.trakt.tv/movie/summary.json/5a6741f036689886bb9d030fed43af82/tt2015381": {
    title: "Guardians of the Galaxy",
    year: 2014,
    released: 1406876400,
    url: "http://trakt.tv/movie/guardians-of-the-galaxy-2014",
    trailer: "http://youtube.com/watch?v=XT4CLuTbI7A",
    runtime: 121,
    tagline: "All heroes start somewhere.",
    overview: "Light years from Earth, 26 years after being abducted, Peter Quill finds himself the prime target of a manhunt after discovering an orb wanted by Ronan the Accuser.",
    certification: "PG-13",
    imdb_id: "tt2015381",
    tmdb_id: 118340,
    rt_id: 0,
    last_updated: 1416942840,
    images: {
      poster: "http://slurm.trakt.us/images/posters_movies/203046.2.jpg",
      fanart: "http://slurm.trakt.us/images/fanart_movies/203046.2.jpg"
    },
    top_watchers: [],
    ratings: {},
    stats: {},
    people: {},
    genres: [
      "Science Fiction",
      "Fantasy",
      "Adventure"
    ]
  },
  "http://api.trakt.tv/movie/summary.json/5a6741f036689886bb9d030fed43af82/tt2397535": {
    title: "Predestination",
    year: 2014,
    released: 1409209200,
    url: "http://trakt.tv/movie/predestination-2014",
    trailer: "http://youtube.com/watch?v=UVOpfpYijHA",
    runtime: 97,
    tagline: "To save the future he must reshape the past.",
    overview: "On his final assignment, a time-travelling Temporal Agent must pursue the one criminal who has eluded him throughout time.",
    certification: "R",
    imdb_id: "tt2397535",
    tmdb_id: 206487,
    rt_id: 0,
    last_updated: 1417061069,
    images: {
      poster: "http://slurm.trakt.us/images/posters_movies/225720.2.jpg",
      fanart: "http://slurm.trakt.us/images/fanart_movies/225720.2.jpg"
    },
    top_watchers: [],
    ratings: {},
    stats: {},
    people: {},
    genres: [
      "Science Fiction",
      "Thriller"
    ]
  }
};