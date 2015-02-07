var path = require("path");

module.exports = {
  name: "koa-base-app",
  port: process.env.PORT || 3000,
  keys: ['some secret hurr'],
  db: {
    username: "root",
    password: "",
    database: "pirateship",
    sync: true,
    forceSync: false
  },
  logs: {
    request: false,
    path: path.join(__dirname, "../../../logs")
  },
  uploads: {
    path: path.join(__dirname, "../../../uploads")
  },
  assets: {
    reload: true,
    cache: false,
    min: false
  },
  errors: {
    debug: true
  },
  path: {
    app: path.join(process.cwd()),
    framework: path.join(process.cwd(), "node_modules", "barbakoa")
  },
  trakt: {
    apikey: "5a6741f036689886bb9d030fed43af82"
  },
  postProcess: {
    enable: true,
    downloadedFolder: path.join(getUserHome(), "Downloads", "torrents", "downloaded"),
    destinationFolder: path.join(getUserHome(), "Downloads", "torrents", "pirateship")
  },
  transmission: {
    host: "localhost",
    port: 9091
  },
  retry: {
    retries: Infinity,
    factor: 2,
    minTimeout: 1000,
    maxTimeout: 1000 * 3600,
    randomize: false
  }
};

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}