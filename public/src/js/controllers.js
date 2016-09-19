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
		$scope.issues = data;
	});

}]);