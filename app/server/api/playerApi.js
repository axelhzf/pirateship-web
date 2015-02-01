var exec = require("mz/child_process").exec;
var Joi = require("joi");
var util = require("util");

var playSchema = Joi.object().keys({
  file: Joi.string().required(),
  source: Joi.string().required()
});

exports.play = function* () {
  var query = yield this.validateQuery(playSchema);
  var file = query.file;
  var source = query.source;
  if (source === "pc") {
    yield playPc.bind(thid, file);
  } else if (source === "tv") {
    yield playTv.bind(this, file);
  }
};

function* playPc(file) {
  try {
    yield exec(util.format("open %s", file));
    this.body = {status: "playing", file: file};
  } catch (e) {
    var msg = util.format("Error playing file %s", file);
    throw Error(msg, e);
  }
}

function* playTv(file) {
  var MediaRendererClient = require('upnp-mediarenderer-client');
  var Ssdp = require('upnp-ssdp');

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


// Instanciate a client with a device description URL (discovered by SSDP)
  var client = new MediaRendererClient('http://192.168.2.118:62042/');

  var relativeFile = file.substring(file.indexOf("Video"));

// Load a stream and play it immediately
  var deviceFile = "file:///tmp/media/usb/" + relativeFile;
  client.load(deviceFile, {autoplay: true}, function (err, result) {
    if (err) throw err;
    console.log('playing ...');
  });

  this.body = {status: "playing", file: file, deviceFile: deviceFile};
}