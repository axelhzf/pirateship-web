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
    console.log("update active episodes");
    this.activeEpisodes.forEach((episode) => {
      var episodeId = this.episodeId(episode);
      this.fileStore.find({query: episodeId}).then((file) => {
        console.log(JSON.stringify(file));
        episode.local = file;
      });
    });
  }

  play(episode) {
    this.player.playTv(episode.local.video);
  }

}

angular.module("app").controller("ShowController", ShowController);