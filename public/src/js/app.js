"use strict";

var app = angular.module("IssuesTrackerApp", ["appModule", "ngSanitize"]);

app.factory("appService", ["$http", function ($http) {
    var obj = {};

	obj.getIssues = function (callback) {
        $http.get("/api/issues").then(function (result) {
			callback(null, result.data);
		}).catch(function (err) {
			callback(err);
		});
    };

    return obj;
}]);
