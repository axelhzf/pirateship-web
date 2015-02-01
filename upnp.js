var MediaRendererClient = require('upnp-mediarenderer-client');
var Ssdp = require('upnp-ssdp');

/*
var client = new Ssdp();
client.on('up', function (address) {
  console.log('server found', address);
});
client.on('down', function (address) {
  console.log('server ' + address + ' not responding anymore');
});
client.on('error', function (err) {
  console.log('error initiating SSDP search', err);
});
client.search('upnp:rootdevice');
*/

// Instanciate a client with a device description URL (discovered by SSDP)
var client = new MediaRendererClient('http://192.168.2.118:62042/');

// Load a stream and play it immediately
var file = "file:///tmp/media/usb/Video/movies/Gone.Girl.2014.720p.BluRay.x264.YIFY.mp4";
client.load(file, { autoplay: true }, function(err, result) {
  if(err) throw err;
  console.log(result);
  console.log('playing ...');

  client.play();
});

// Pause the current playing stream
//client.pause();

// Unpause
//client.play();

// Stop
//client.stop();

// Seek to 10 minutes
//client.seek(10 * 60);