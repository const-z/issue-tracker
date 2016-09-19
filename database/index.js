"use strict";

require("rootpath")();

const Mongoose = require("mongoose");
const config = require("config");

Mongoose.Promise = global.Promise;
Mongoose.connect(config.database.mongo.url);
Mongoose.set("debug", config.database.mongo.debug);

module.exports = {
    User: require("./user.js"),
	Token: require("./token.js")
};