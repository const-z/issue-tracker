"use strict";

var appModule = angular.module("appModule", []);

appModule.controller("mainController", ["$scope", "$timeout", "appService", function ($scope, $timeout, appService) {

	$scope.issues = [];

	$scope.location = function (part) {
		if (window.location.pathname === "/" && part === "/") {
			return true;
		} else if (part === "/") {
			return false;
		}
		return window.location.pathname.indexOf(part) === 0;
	};

	appService.getIssues(function(err, data){
		if (err) {
			return console.error(err);
		}

		for (var j in data) {
			var lastComment = {};
			var task = data[j];
			for (var i in task.comments) {
				if (task.comments[i].content.raw) {
					lastComment = {
						content: task.comments[i].content.html,
						created: task.comments[i].created_on
					};
				}
			}
			task.lastComment = lastComment;
		}
		$scope.issues = data;
	});

}]);