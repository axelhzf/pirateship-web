var imageService = require("../../../app/server/services/imageService");
var sinon = require("sinon");
var fs = require("mz/fs");
var sizeOf = require("image-size");
var Promise = require("bluebird");

sizeOf = Promise.promisify(sizeOf);

describe("imageService", function () {

  var fixturePath = __dirname + "/../fixtures/train-dragon.jpg";

  beforeEach(function () {
    sinon.stub(imageService, "_downloadUrl", function (url, file) {
      // copy a fixture file to simulate download
      return new Promise(function (resolve) {
        fs.createReadStream(fixturePath)
          .pipe(fs.createWriteStream(file))
          .on("finish", resolve);
      });
    });
  });

  afterEach(function () {
    imageService._downloadUrl.restore();
  });

  it("should download an image and resize images", function* () {
    var url = "http://slurm.trakt.us/images/posters_movies/188775.2.jpg";
    var imageName = "img";
    var localPath = yield imageService.downloadImage(url, imageName);
    assertFileExist(localPath);
  });

  it("should resize an image", function* () {
    var resizedImage = yield imageService.resizeImage(fixturePath);
    assertFileExist(resizedImage);
    var dimensions = yield sizeOf(resizedImage);
    expect(dimensions).to.include({
      width: 400,
      height: 570
    });
    yield fs.unlink(resizedImage);
  });

});

function* assertFileExist(file) {
  var fileExists = yield fs.exists(file);
  expect(fileExists).to.be.true;
}