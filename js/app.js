
'use strict';

var myApp = angular.module('RecipeApp', ['ui.router']);

myApp.config(['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider){
	
		$stateProvider
			//The home page
			.state('home', {
				url: '/', 
				templateUrl: 'partials/home.html' 
			})
			//The abstract parent page
			.state('category', {
				url:'/vategory',
				templateUrl: 'partials/category.html', 
			})
				//The order list page 
			.state('detail', {
					url:'/detail',
					templateUrl: 'partials/detail.html',
					controller: 'detailsCtrl'
				})
				//The shopping cart page
			.state('list', {
				url:'/list',
				templateUrl: 'partials/list.html', //path of the partial to load
			})
			//the detail Page
			.state('signIn', {
				url:'/signIn',
				templateUrl: 'partials/signIn.html',//path of the partial to load
			})
			$urlRouterProvider.otherwise('/');
			
}]);

// myApp.factory('recipeDetails', ['$http','$q', function($http, $q){
// 	var result;
// 	function getRecipe(id){
// 		var deferred = $q.defer();
// 		$http.get('http://api.yummly.com/v1/api/recipe/' + "Greek-Yoghurt-with-Apple-and-Blackberry-Compote-and-Pistachios-1735728" + '?_app_id=727f9e61&_app_key=6432cf347203b199cad6e4ccd21ba822')
// 			.success(function (data) {
// 			result = data;
// 		});
// 		return {
// 			getResult: function () {
// 				return result;
// 			}
// 		}
// 	};
// }]);

myApp.controller('detailsCtrl', ['$scope', '$http', function($scope, $http){
	// var data = {url:"http://www.tacobueno.com/media/1339/beeftacolarge.png?quality=65"};
	// console.log(data);
	// $scope.info = data;
	// var data = recipeDetails.getRecipe('Greek-Yoghurt-with-Apple-and-Blackberry-Compote-and-Pistachios-1735728"').getResult().then(function(data){
	// 	console.log(data);
	// })
	// console.log(data);
	var related;
	$http.get('http://api.yummly.com/v1/api/recipe/' + "Greek-Yoghurt-with-Apple-and-Blackberry-Compote-and-Pistachios-1735728" + '?_app_id=727f9e61&_app_key=6432cf347203b199cad6e4ccd21ba822')
		.success(function (data) {
			$scope.detail = data;
		//result = data;
		related = data.attributes.course[0];
		console.log(related);
		console.log(data);
		$http.get('http://api.yummly.com/v1/api/recipes?_app_id=727f9e61&_app_key=6432cf347203b199cad6e4ccd21ba822&q' + related).success(function(result){
			console.log(result);
			$scope.related = result;
		})
	});
	//$scope.data = result;
	console.log(related);
	//var related = result.course[0];
	//console.log(related);
	// $http.get('http://api.yummly.com/v1/api/recipes?_app_id=727f9e61&_app_key=6432cf347203b199cad6e4ccd21ba822' + )

	$scope.addToList = function (name, list) {
		
	};

}]);
