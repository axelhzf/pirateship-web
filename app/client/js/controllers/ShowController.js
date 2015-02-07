class ShowController {
  constructor(showsStore, $stateParams, torrentsStore, fileStore, player) {
    this.showsStore = showsStore;
    this.$stateParams = $stateParams;
    this.torrentsStore = torrentsStore;
    this.fileStore = fileStore;
    this.player = player;

    this.fetchShow();
  }

  fetchShow() {
    this.showsStore.get(this.$stateParams.id).then((show) => {
      this.show = show;
      this.seasons = _.sortBy(_.unique(_.pluck(this.show.episodes, "season")));
      this.episodesBySeason = _.groupBy(_.sortBy(this.show.episodes, "number"), "season");
      this.setActiveSeason(_.last(this.seasons));
    });
  }

  setActiveSeason(activeSeason) {
    this.activeSeason = activeSeason;
    this.activeEpisodes = this.episodesBySeason[this.activeSeason];
    this.updateActiveEpisodeFile();
  }

  pad(number) {
    return s.pad(number, 2, "0");
  }

  download(episode) {
    var query = this.episodeId(episode) + " 720p";
    this.torrentsStore.find({query: query}).then((torrents) => {
      this.torrentsStore.download(torrents[0].link).then(() => {
        console.log("downloading");
      });
    });
  }

  episodeId(episode) {
    var show = this.show.title;
    var season = episode.season;
    var number = episode.number;
    var episodeId = show + " S" + this.pad(season) + "E" + this.pad(number);
    return episodeId;
  }

  updateActiveEpisodeFile() {
    this.activeEpisodes.forEach((episode) => {
      var episodeId = this.episodeId(episode);
      this.fileStore.find({query: episodeId}).then((file) => {
        episode.local = file;
      });
    });
  }

  play(episode) {
    this.player.playTv(episode.local.video);
  }
  
  episodeIsAvailableToDownload(episode) {
    var episodeTime = new Date(episode.first_aired).getTime();
    if (episodeTime === 0) return false;
    return episodeTime < Date.now();
  }
  
  subtitlesState(episode) {
    var langs = _.keys(episode.local.subtitles);
    if (langs.length >= 2) {
      return "subtitles-completed";
    } else if (langs.length > 0) {
      return "subtitles-partial";
    }
  }

}

angular.module("app").controller("ShowController", ShowController);