(function(module) {
try {
  module = angular.module('app');
} catch (e) {
  module = angular.module('app', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/buttonPromise.html',
    '<a><i class="{{activeIcon}}"></i></a>');
}]);
})();

(function(module) {
try {
  module = angular.module('app');
} catch (e) {
  module = angular.module('app', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/config.html',
    '<div class="config"><h1>Configuration</h1><form><div class="form-group"><label>Run as</label><select ng-model="configuration.runAs" class="form-control"><option value="local">Local</option><option value="remote">Remote</option></select></div><div ng-if="configuration.runAs == \'local\'"><h2>Folders</h2><fieldset class="folders"><div class="form-group"><label>Downloaded folder<small> (Downloaded folder in utorrent configuration)</small></label><input ng-model="configuration.downloadedFolder" class="form-control"/></div><div class="form-group"><label>TvShows folder<small> (Different folder to organize your tvshows)</small></label><input ng-model="configuration.tvshowsFolder" class="form-control"/></div><p>Configure two separate folders for dowloading and downloaded torrents</p><img src="client/images/utorrent-config-folders.png"/></fieldset><h2>uTorrent</h2><fieldset class="utorrent"><div class="form-group"><label>Username</label><input ng-model="configuration.utorrentUser" class="form-control"/></div><div class="form-group"><label>Password</label><input ng-model="configuration.utorrentPassword" class="form-control"/></div><div class="form-group"><label>Port</label><input ng-model="configuration.utorrentPort" class="form-control"/></div><p>Enable webui in utorrent configuration</p><img src="client/images/utorrent-config-remote.png"/></fieldset></div><div ng-if="configuration.runAs == \'remote\'"><h2>Remote</h2><fieldset class="server"><div class="form-group"><label>Host</label><input ng-model="configuration.remoteHost" class="form-control"/></div><div class="form-group"><label>Port</label><input ng-model="configuration.remotePort" class="form-control"/></div><div class="form-group"><label>Mounted folder</label><input ng-model="configuration.remoteMount" class="form-control"/></div></fieldset></div><div class="actions"><button type="submit" ng-click="save()" class="btn btn-primary">Save</button></div></form></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('app');
} catch (e) {
  module = angular.module('app', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/downloads.html',
    '<div class="content downloads"><h1>Downloads</h1><table ng-if="ctrl.downloads"><thead><tr><th></th><th>Status</th><th>Name</th><th>Progress</th><th>Speed</th><th>ETA</th></tr></thead><tbody><tr ng-repeat="download in ctrl.downloads"><td class="actions"><a ng-if="download.status === 0" ng-click="ctrl.start(download)"><i class="ion-play"></i></a><a ng-if="download.status === 4" ng-click="ctrl.stop(download)"><i class="ion-pause"></i></a></td><td class="status">{{ctrl.statusText(download.status)}}</td><td><span ng-if="download.movie"><a ui-sref="movie({id: download.movie.id})">{{download.name}}</a></span><span ng-if="!download.movie">{{download.name}}</span></td><td class="percentDone">{{download.percentDone * 100 | number}}%</td><td class="download">{{download.rateDownload / 1000 | kbFmt:2}}/s</td><td class="eta">{{download.eta | eta}}</td></tr></tbody></table></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('app');
} catch (e) {
  module = angular.module('app', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/fadeImg.html',
    '<img ng-src="{{trustedSrc}}" ng-class="{visible: loaded}" class="fadeImg"/>');
}]);
})();

(function(module) {
try {
  module = angular.module('app');
} catch (e) {
  module = angular.module('app', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/hd.html',
    '<span ng-if="isVisible()"><img src="client/icons/hd.svg" class="hd"/></span>');
}]);
})();

(function(module) {
try {
  module = angular.module('app');
} catch (e) {
  module = angular.module('app', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/header.html',
    '<div ng-controller="HeaderController as ctrl" class="header"><div class="header-left"><div class="brand">Pirateship</div><form ng-submit="ctrl.onSubmit()"><input type="text" ng-model="ctrl.query" placeholder="Search..."/><a ng-click="h.clearQuery()" ng-class="{visible: ctrl.query.length &gt; 0}" class="input-clear"><i class="ion-ios7-close-outline"></i></a></form></div><div class="header-right"><a ui-sref="movies" ui-sref-active="active" class="icon">Movies</a><a ui-sref="shows" ui-sref-active="active" class="icon">Shows</a><a ui-sref="torrents" ui-sref-active="active" class="icon">Torrents</a><a ui-sref="downloads" ui-sref-active="active" class="icon">Downloads</a><a ui-sref="recents" ui-sref-active="active" class="icon">Recents</a></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('app');
} catch (e) {
  module = angular.module('app', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/logs.html',
    '<div class="content"><h1>Logs</h1><table><tr ng-repeat="log in ctrl.logs"><td>{{log.time}}</td><td>{{log.component}}</td><td>{{log.msg}}</td></tr></table></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('app');
} catch (e) {
  module = angular.module('app', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/modal.html',
    '<div ng-show="visible" class="modal-alert"><div ng-transclude="" class="modal-alert-content"></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('app');
} catch (e) {
  module = angular.module('app', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/recent.html',
    '<div class="content recent"><h1>Recent</h1><ul class="display"><li><a ng-click="ctrl.setDisplay(\'list\')"><i class="ion-ios-list"></i></a></li><li><a ng-click="ctrl.setDisplay(\'group\')"><i class="ion-ios-photos"></i></a></li></ul><div ng-if="ctrl.display === \'list\'"><table><thead><tr><th>Filename</th><th>Date</th></tr></thead><tbody><tr ng-repeat="recent in ctrl.recent"><td>{{recent.file}}</td><td>{{recent.createdAt | relativeDate }}</td></tr></tbody></table></div><div ng-if="ctrl.display === \'group\'"><div class="poster-list"><a ng-repeat="show in ctrl.shows" ui-sref="show({id: show.id})" class="poster-list-item"><div class="poster-image"><fade-img img="{{show.image_poster_thumb}}"></fade-img><div class="badge">{{show.episodes.length}}</div><div class="backdrop"><i class="ion-ios7-eye"></i></div><div ng-if="show.favorite" class="post-list-content"><i class="ion-ios7-heart"></i></div></div><div class="poster-data"><div class="poster-title">{{show.title}}</div></div></a></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('app');
} catch (e) {
  module = angular.module('app', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/server_connect.html',
    '<div ng-if="!s.connected" class="connecting"><h2>Connecting to server</h2><h3>{{s.client.host}}</h3><div class="spinner"><i class="ion-ios7-reloading"></i></div><a ui-sref="config" class="btn">Can\'t connect? Check your configuration</a></div><ui-view ng-if="s.connected"></ui-view>');
}]);
})();

(function(module) {
try {
  module = angular.module('app');
} catch (e) {
  module = angular.module('app', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/spinner.html',
    '<div ng-if="waitFor === undefined" class="spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('app');
} catch (e) {
  module = angular.module('app', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/subtitles_status.html',
    '<span ng-if="episode.local.file" class="subtitles-status"><a ng-click="downloadSubtitles()" class="subtitles-status-{{status}}">srt</a></span>');
}]);
})();

(function(module) {
try {
  module = angular.module('app');
} catch (e) {
  module = angular.module('app', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/torrents.html',
    '<div class="content torrents"><h1>Torrents</h1><form ng-submit="ctrl.search()"><input ng-model="ctrl.tmpSearchQuery"/></form><torrents-list query="ctrl.searchQuery"></torrents-list></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('app');
} catch (e) {
  module = angular.module('app', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/torrentsLists.html',
    '<table class="torrent-list"><thead><tr><th>Name</th><th>Seeds</th><th>Leechers</th></tr></thead><tbody><tr ng-repeat="torrent in ctrl.torrents" class="torrent-list-item"><td><a ng-click="ctrl.downloadMagnet(torrent.link)">{{torrent.title}}</a></td><td>{{torrent.seeds}}</td><td>{{torrent.leechers}}</td></tr></tbody></table>');
}]);
})();

(function(module) {
try {
  module = angular.module('app');
} catch (e) {
  module = angular.module('app', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/utorrent_status.html',
    '<div ng-if="episode.utorrent" class="utorrent-status"><div ng-style="{width: episode.utorrent.percentProgress/10 + \'%\' }" class="utorrent-status-progress"></div><div class="utorrent-status-text"><span ng-if="episode.utorrent.percentProgress &lt; 1000">{{episode.utorrent.percentProgress / 10 | number:0}}% - {{episode.utorrent.eta | humanizeEta}} - {{episode.utorrent.downloadSpeed | speed}}</span><span ng-if="episode.utorrent.percentProgress &gt;= 1000">{{episode.utorrent.percentProgress / 10 | number:0}}%</span></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('app');
} catch (e) {
  module = angular.module('app', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/youtube_player.html',
    '<div class="youtube-player"><div ng-click="ctrl.showModal()" class="thumbnail"><fade-img img="{{ctrl.thumbnailUrl()}}"></fade-img><div class="backdrop"><i class="ion-play"></i></div></div><div ng-if="ctrl.modalVisible" class="youtube-player-modal"><a ng-click="ctrl.hideModal()" class="close"><i class="ion-close-circled"></i></a><iframe type="text/html" width="560" height="315" allowfullscreen="allowfullscreen" frameborder="0" ng-src="{{ctrl.embedUrl()}}"></iframe></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('app');
} catch (e) {
  module = angular.module('app', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/movies/movie.html',
    '<div style="background-image:url({{ctrl.movie.images.fanart.medium}});" class="content movie"><div class="movie-backdrop"></div><div class="left"><div class="img-container"><fade-img img="{{ctrl.movie.images.poster.medium}}"></fade-img></div><div class="rating"><div class="rating-inner">{{ctrl.movie.rating}}</div></div><div class="actions"><div ng-if="!ctrl.download"><a ng-click="ctrl.downloadMagnet(ctrl.movie.yts_magnet)" class="btn">Download</a></div><div ng-if="ctrl.download"><a class="btn">{{ctrl.download.progress / 10}}% - {{ctrl.download.speed / 1000 | kbFmt:2}}/s</a></div></div></div><div class="center"><h1>{{ctrl.movie.title}}</h1><p class="overview">{{ctrl.movie.overview}}</p><ul class="tabs"><li><a ng-class="{active: ctrl.tab === \'trailer\'}" ng-click="ctrl.tab = \'trailer\'">Trailer</a></li><li><a ng-class="{active: ctrl.tab === \'torrents\'}" ng-click="ctrl.tab  = \'torrents\'">Torrents</a></li></ul><div ng-if="ctrl.tab == \'trailer\'" class="tab-trailer"><youtube-player video-url="ctrl.movie.trailer"></youtube-player></div><div ng-if="ctrl.tab == \'torrents\'" class="tab-torrents"><table class="torrents"><thead><tr><th>Name</th><th>Seeds</th><th>Leechers</th></tr></thead><tbody><tr ng-repeat="torrent in ctrl.torrents" class="torrent-item"><td><a ng-click="ctrl.downloadMagnet(torrent.link)">{{torrent.title}}</a></td><td>{{torrent.seeds}}</td><td>{{torrent.leechers}}</td></tr></tbody></table></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('app');
} catch (e) {
  module = angular.module('app', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/movies/movies.html',
    '<div class="content movies"><div ui-view="ui-view"></div><h1>Movies</h1><div class="poster-list"><a ng-repeat="movie in ctrl.movies.items" ui-sref="movie({imdb: movie.ids.imdb})" class="poster-list-item"><div class="poster-image"><fade-img img="{{movie.images.poster.thumb}}"></fade-img><div class="rating">{{movie.rating}}</div><div class="backdrop"><i class="ion-ios7-eye"></i></div><div ng-if="show.favorite" class="post-list-content"><i class="ion-ios7-heart"></i></div></div><div class="poster-data"><div class="poster-title">{{movie.title}}</div><div class="poster-genre">{{movie.genres[0]}}</div></div></a></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('app');
} catch (e) {
  module = angular.module('app', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/search/search.html',
    '<div class="content movies"><div ui-view="ui-view"></div><h1>Search Results</h1><div class="poster-list"><div ng-repeat="searchItem in ctrl.search.items" ng-click="ctrl.navigate(searchItem)" class="poster-list-item"><div class="poster-image"><fade-img img="{{searchItem.images.poster.thumb}}"></fade-img><div class="rating">{{searchItem.rating}}</div><div class="backdrop"></div><a ng-click="ctrl.toggleFav($event, searchItem)" class="fav"><i ng-if="searchItem.favorite" class="fav-true ion-android-favorite"></i><i ng-if="!searchItem.favorite" class="fav-false ion-android-favorite-outline"></i></a></div><div class="poster-data"><div class="poster-title">{{searchItem.title}}</div><div class="poster-genre">{{searchItem.genres[0]}}</div></div></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('app');
} catch (e) {
  module = angular.module('app', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/shows/show.html',
    '<div ng-if="ctrl.show" style="background-image:url({{ctrl.show.images.fanart.medium}});" class="content show"><div class="movie-backdrop"></div><div class="left"><div class="img-container"><fade-img img="{{ctrl.show.images.poster.medium}}"></fade-img><div class="rating"><div class="rating-inner">{{ctrl.show.rating | number: 0}}</div></div></div></div><div class="center"><h1> {{ctrl.show.title}} / S{{ctrl.pad(ctrl.activeSeason)}}<div class="all-seasons"><span>All seasons:</span><ul class="list-inline"><li ng-repeat="season in ctrl.seasons"><a ng-click="ctrl.setActiveSeason(season)">{{ season }}</a></li></ul></div></h1><table><tr ng-repeat="episode in ctrl.activeEpisodes" ng-class="{notAvailable: !ctrl.episodeIsAvailableToDownload(episode) }"><td>S{{ctrl.pad(ctrl.activeSeason)}}E{{ctrl.pad(episode.number)}} - {{episode.title}}</td><td>{{episode.first_aired | relativeDate }}</td><td class="actions"><div ng-if="ctrl.episodeIsAvailableToDownload(episode)"><a ng-click="ctrl.downloadSubtitles(episode)" ng-if="episode.local.video" class="{{ctrl.subtitlesState(episode)}}"><i class="ion-closed-captioning"></i></a><a ng-click="ctrl.play(episode)" ng-if="episode.local.video"><i class="ion-ios-play"></i></a><a ng-click="ctrl.download(episode)" ng-if="!episode.local.video"><i class="ion-ios-cloud-download"></i></a><a ui-sref="torrents({query: ctrl.episodeId(episode)})" ng-if="!episode.local.video"><i class="ion-ios-search-strong"></i></a></div></td></tr></table></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('app');
} catch (e) {
  module = angular.module('app', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/shows/shows.html',
    '<div class="content movies"><div ui-view="ui-view"><h1>Shows</h1><h2>Favorites</h2><div class="poster-list"><div ng-repeat="show in ctrl.favs.items track by show.ids.imdb" class="poster-list-item"><div ui-sref="show({imdb: show.ids.imdb})" class="poster-image"><fade-img img="{{show.images.poster.thumb}}"></fade-img><div class="rating">{{show.rating | number: 0}}</div><div class="backdrop"></div><a ng-click="ctrl.toggleFav($event, show)" class="fav"><i ng-if="show.favorite" class="fav-true ion-android-favorite"></i><i ng-if="!show.favorite" class="fav-false ion-android-favorite-outline"></i></a></div><div class="poster-data"><div class="poster-title">{{show.title}}</div></div></div></div><h2>Popular</h2><div class="poster-list"><div ng-repeat="show in ctrl.popular.items track by show.ids.imdb" class="poster-list-item"><div ui-sref="show({imdb: show.ids.imdb})" class="poster-image"><fade-img img="{{show.images.poster.thumb}}"></fade-img><div class="rating">{{show.rating | number: 0}}</div><div class="backdrop"></div><a ng-click="ctrl.toggleFav($event, show)" class="fav"><i ng-if="show.favorite" class="fav-true ion-android-favorite"></i><i ng-if="!show.favorite" class="fav-false ion-android-favorite-outline"></i></a></div><div class="poster-data"><div class="poster-title">{{show.title}}</div></div></div></div></div></div>');
}]);
})();
