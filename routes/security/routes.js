"use strict";

const Handlers = require("./handlers");

module.exports = [

    { method: "POST", path: "/login", config: Handlers.security.login },
    { method: "GET", path: "/logout", config: Handlers.security.logout }

];
