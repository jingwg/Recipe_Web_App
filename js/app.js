
'use strict';

var myApp = angular.module('RecipeApp', ['ngSanitize', 'ui.router', 'ui.bootstrap', 'firebase']);


myApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

	$stateProvider
		//The home page
		.state('home', {
			url: '/',
			templateUrl: 'partials/home.html'
		})
		//The abstract parent page
		.state('category', {
			url: '/category',
			templateUrl: 'partials/category.html'
		})
		//The order list page 
		.state('detail', {
			url: '/detail',
			templateUrl: 'partials/detail.html',
			controller: "JingwenDetailCtrl"
		})
		//The abstract list page
		.state('lists', {
			abstract: true,
			url: '/lists',
			templateUrl: 'partials/lists.html', //path of the partial to load
			controller: "ListCtrl"
		})
		//the lists page
		.state('lists.list', {
			url: '',
			templateUrl: 'partials/lists.list.html', //path of the partial to load
			controller: "ListCtrl"
		})
		.state('listDetail', {
			url: '/lists/:list',
			templateUrl: 'partials/listDetail.html', //path of the partial to load
			controller: "ListDetailCtrl"
		})
		//the signIn Page
		.state('signIn', {
			url: '/signIn',
			templateUrl: 'partials/signIn.html',//path of the partial to load
			controller: 'signCtrl'
		})
		//$urlRouterProvider.otherwise('/');
		//the search Page
		.state('search', {
			url: '/search/:searchTerm',
			templateUrl: 'partials/search.html'//path of the partial to load
		})
		$urlRouterProvider.otherwise('/');

}]);

myApp.controller('FeatureCtrl', ['$scope', '$http', function ($scope, $http) {

	$http.get('http://api.yummly.com/v1/api/recipes?_app_id=727f9e61&_app_key=6432cf347203b199cad6e4ccd21ba822&q=').then(function (response) {
		$scope.message = "HELLO";
		var data = response.data.matches;
		$scope.topFour = _.sampleSize(data, 4);
		console.log($scope.topFour);


	});
}]);

myApp.controller('recipiesSearch', ['$scope', '$http', '$location', '$stateParams', function ($scope, $http, $location, $stateParams) {

	/*
		if I have a search term
				get the data
				show the data
		
		> button 

	*/

	if($stateParams.searchTerm !== '') {
		console.log('hi');
		console.log($stateParams);
		console.log($stateParams.searchTerm);
		$http.get('http://api.yummly.com/v1/api/recipes?_app_id=727f9e61&_app_key=6432cf347203b199cad6e4ccd21ba822&q=' +
				  $stateParams.searchTerm).then(function (response) {
			var data = response.data;

			var searchObject = $stateParams.searchTerm;
			// $location.search('q', searchTerm);
			console.log(searchObject);
			$scope.items = data.matches;
			console.log($scope.items);
		});
	};
	$scope.sendDetails = function(id) {
		$scope.id = id;
		console.log($scope.id);
	};
}]);
//the signIn controller
myApp.controller('signCtrl', ['$scope', '$firebaseAuth', '$firebaseObject', function ($scope, $firebaseAuth, $firebaseObject) {
	//the main firebase reference

	var Auth = $firebaseAuth();
	$scope.newUser = {};
	var baseRef = firebase.database().ref();
	var usersRef = baseRef.child('users'); //refers to "users" value

	$scope.signUp = function () {
		console.log($scope.newUser.handle);
		console.log($scope.newUser.avatar);
		//create user
		Auth.$createUserWithEmailAndPassword($scope.newUser.email, $scope.newUser.password)
			.then(function (firebaseUser) {
				//display loginView
				$scope.userId = firebaseUser.uid;
				console.log('user created: ' + firebaseUser.uid);
				var userData = { 'email': $scope.newUser.email, 'password': $scope.newUser.password };
				var newUserRef = usersRef.child(firebaseUser.uid);
				newUserRef.set(userData); //set the key's value to be the object you created
			})
			.catch(function (error) { //report any errors
				console.log(error);
			});

		$scope.users = $firebaseObject(usersRef);
		console.log($scope.users)
	}
	Auth.$onAuthStateChanged(function (firebaseUser) {
		if (firebaseUser) {
			console.log('logged in');
			$scope.userId = firebaseUser.uid;
		}
		else {
			console.log('logged out');
			$scope.userId = undefined;
		}
	});

	$scope.signOut = function () {
		Auth.$signOut(); //AngularFire method
	};

	//respond to "Sign In" button
	$scope.signIn = function () {
		Auth.$signInWithEmailAndPassword($scope.newUser.email, $scope.newUser.password); //AngularFire method
	};




}])

//The controller I designed for the button to show the modal
myApp.controller('JingwenDetailCtrl', ['$scope', '$http', '$uibModal', 'ListService', function ($scope, $http, $uibModal, ListService) {
	$scope.lists = ListService.lists;
	//show modal
	$scope.showListModal = function () {
		var modalInstance = $uibModal.open(
			{
				templateUrl: 'partials/select-list-modal.html',
				controller: 'ModalCtrl',
				scope: $scope // pass in all the scope variables
			})
		modalInstance.result.then(function (selectedItem) {
			//put item on the scope!
			$scope.list = selectedItem;
			console.log("Now selected: ", $scope.list);
		});

	}//end of show Modal
}])

//the controller for the modal display all the lists for user to choose
myApp.controller('ModalCtrl', ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
	//display the lists
	$scope.select = function (list) {
		$scope.searchList = list;
		//console.log('You selected', movie);
	}

	//add recipe to the selected list


	//close the modal
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};

}]);

//the list controller, let user interact will all the lists

myApp.controller('ListCtrl', ["$scope", "ListService", function ($scope, ListService) {
	$scope.lists = ListService.lists; // list is an array [list1, list2, list3], list1 = {name:favorite, content: [recipeA, recipeB, recipeC]}

	//delete specific list
	$scope.deleteList = function (listName) {
		console.log(listName);
		ListService.deleteList(listName);
		$scope.lists = ListService.lists;
		alert("You successfuly deleted that!")
	}

	//create new plan
	$scope.addList = function (listName) {
		var newList = {};
		newList.name = $scope.listName;
		newList.content = [];
        ListService.addList(newList);
	}

	//random create a new plan
	$scope.random = function(){
		ListService.random();
	}

}])

//The controllerlet the listDetail page diplays all the recipe in the recipe list
myApp.controller('ListDetailCtrl', ["$scope", "$stateParams", "ListService", "$filter", function ($scope, $stateParams, ListService, $filter) {
	var lists = ListService.lists;
	var targetList = [];
	for (var i = 0; i < lists.length; i++) {
		var tempList = lists[i];
		if (tempList.name == $stateParams.list) {
			targetList = lists[i];
		}
	}
	//console.log(targetList);
	$scope.recipes = targetList.items;
	
	console.log($scope.recipes);
	var rowCount = $('#threeColor').length;
	if (rowCount % 3 == 1) {
		$('#threeColor:last').css("background", "grey");  
	}
	else if (rowCount % 3 == 2) {
		$('#threeColor:nth-last-child(5)').css("background", "yellow");   
		$('#threeColor:nth-last-child(2)').css("background", "grey");   	 	 
		$('#threeColor:last').css("background", "grey");  
	}

}])

//stored different lists

myApp.factory('ListService', ['$http',function ($http) {
	var service = {};
	service.lists = [];
	service.randomCount = 1;
	// create the random meal plan
	service.random = function(){
	$http.get("https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/mealplans/generate?mashape-key=6BPjQnUGhCmsh3XpfwGoxWIB9Jsnp1uHxXFjsnYyFmnCQ7eA3f "
	).then(function (response) {
			var data = response.data;

			data.name = "Random Meal Plan" + service.randomCount;
			var meals = data.items;
			for(var i = 0; i < meals.length; i++){
				//change the meal name
				var value = JSON.parse(meals[i].value);
				meals[i].name = value.title;
				
				//change the slot
				var slot = meals[i].slot;
				if(slot == 1){
					 meals[i].slot = "breakfast";
				}else if(slot == 2){
					meals[i].slot = "lunch";
				}else if(slot == 3){
					meals[i].slot = "dinner";
				}
				//remove day 
				if(i%3!=0){
					meals[i].day = "";
				}
				
				}
			service.lists.push(data);
			service.randomCount ++;
	})
	}//end of random 

	//the default list
	var testOb = {name:"kale smothie"}
	var testList = { name: "favorite", items: [testOb] };
	service.lists.push(testList);


	//add recipe from the detail page to specific list
	//recipe = new recipe object
	//listName = ngModel the name
	service.addRecipe = function (recipe, ListName) {
		var listIndex = 0;
		for (var i = 0; i < service.lists.length; i++) {
			var tempList = service.lists[i];
			if (tempList.name == ListName) {
				listIndex = i;
				service.lists[i].content.push(recipe);
			}
		}
	};

	//add a new List into Lists
	service.addList = function (newlist) {
		service.lists.push(newlist);
		console.log("Add new List");
		console.log(service.lists);
	}

	//delete the list from the lists
	service.deleteList = function (ListName) {
		var index = 0;
		for (var i = 0; i < service.lists.length; i++) {
			var tempList = service.lists[i];
			//find which list the user want to delete
			if (tempList.name == ListName) {
				index = 1;
			}
		}
		service.lists.splice(index, 1);

	};

	return service;

}]);

