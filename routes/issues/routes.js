"use strict";

require("rootpath")();

const Handlers = require("./handlers");

module.exports = [

	{ method: "GET", path: "", config: Handlers.issues.get }

];

