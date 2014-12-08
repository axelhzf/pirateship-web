class DownloadsController {

  constructor(downloadsStore, $interval, $scope) {
    this.$interval = $interval;
    this.downloadsStore = downloadsStore;

    $scope.$on("$destroy", () => {
      this.stopInterval()
    });

    this.startInterval();
  }

  destroy() {
    this.stopInterval();
  }

  startInterval() {
    this.fetchDownloads();
    this.interval = this.$interval(() => {
      this.fetchDownloads();
    }, 1000);
  }

  stopInterval() {
    if (this.interval) {
      this.$interval.cancel(this.interval);
    }
  }

  fetchDownloads() {
    this.downloadsStore.find().then((downloads) => {
      this.downloads = downloads;
    });
  }

  statusText(code) {
    var codes = {
      STOPPED: 0,  //Torrent is stopped
      CHECK_WAIT: 1, // Queued to check files
      CHECK: 2,  // Checking files
      DOWNLOAD_WAIT: 3,  // Queued to download
      DOWNLOAD: 4,  // Downloading
      SEED_WAIT: 5,  // Queued to seed
      SEED: 6,  // Seeding
      ISOLATED: 7  // Torrent can't find peers
    };
    return _.invert(codes)[code];
  }

  start(download) {
    this.downloadsStore.start(download.id);
  }

  stop(download) {
    this.downloadsStore.stop(download.id);
  }


}

angular.module("app").controller("DownloadsController", DownloadsController);