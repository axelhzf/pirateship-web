var barbakoa = require("barbakoa");
var router = barbakoa.router;

var app = new barbakoa();

require("./routes");

app.start();
