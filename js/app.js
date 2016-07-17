
'use strict';

var myApp = angular.module('RecipeApp', ['ngSanitize', 'ui.router', 'ui.bootstrap']);

	myApp.config(['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider){
		
			$stateProvider
				//The home page
				.state('home', {
					url: '/', 
					templateUrl: 'partials/home.html' 
				})
				//The abstract parent page
				.state('category', {
					url:'/category',
					templateUrl: 'partials/category.html' 
				})
				 //The order list page 
  				.state('detail', {
					  url:'/detail',
   					 templateUrl: 'partials/detail.html' 
				 })
				 //The shopping cart page
        		.state('list', {
					url:'/list',
					templateUrl: 'partials/list.html' //path of the partial to load
				})
				//the detail Page
				.state('signIn', {
					url:'/signIn',
					templateUrl: 'partials/signIn.html'//path of the partial to load
				})
				//$urlRouterProvider.otherwise('/');
				//the search Page
				.state('search', {
					url:'/search',
					templateUrl: 'partials/search.html'//path of the partial to load
				})
				$urlRouterProvider.otherwise('/');
				
	}]);




myApp.controller('recipiesSearch', ['$scope', '$http', function ($scope, $http) {
	$http.get('http://api.yummly.com/v1/api/recipes?_app_id=727f9e61&_app_key=6432cf347203b199cad6e4ccd21ba822&q=chicken').then(function (response) {
		var data = response.data;
		//do something with the data from the response...
		//like put it on the $scope to show it in the view!
		$scope.things = data.matches;
		console.log($scope.things);
	});
	//var searchTerm = $scope.searchTerm;
	$scope.searchItem = function(searchTerm) {
	$http.get('http://api.yummly.com/v1/api/recipes?_app_id=727f9e61&_app_key=6432cf347203b199cad6e4ccd21ba822&q=' + searchTerm).then(function(response) {
		var data = response.data;
		//do something with the data from the response...
		//like put it on the $scope to show it in the view!
		$scope.items = data.matches;
		console.log($scope.items);
		//console.log($scope.items[0].recipeName)
	});
	};
}]);