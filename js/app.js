
'use strict';

var myApp = angular.module('RecipeApp', ['ngSanitize','ui.router']);

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

	//some silly code
