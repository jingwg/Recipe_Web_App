
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
   					 templateUrl: 'partials/detail.html' ,
						controller:"detailsCtrl"
				 })
				 //The abstract list page
        		.state('lists', {
					abstract:true,
					url:'/lists',
					templateUrl: 'partials/lists.html', //path of the partial to load
					controller:"ListCtrl"
				})
				//the lists page
				.state('lists.list', {
					url:'',
					templateUrl: 'partials/lists.list.html', //path of the partial to load
					controller:"ListCtrl"
				})
				.state('listDetail', {
					url:'/lists/:list',
					templateUrl: 'partials/listDetail.html', //path of the partial to load
					controller:"ListDetailCtrl"
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

    //add the recipe from the detail controller
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

//the controller for the modal display all the lists for user to choose
myApp.controller('ModalCtrl', ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
	//display the lists
	$scope.select = function(list){
		$scope.searchList = list;
		//console.log('You selected', movie);
	}
	
	//add recipe to the selected list
	
	
	//close the modal
	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};

}]);

//the list controller, let user interact will all the lists
    myApp.controller('ListCtrl',["$scope","ListService", function($scope, ListService){
		$scope.lists = ListService.lists; // list is an array [list1, list2, list3], list1 = {name:favorite, content: [recipeA, recipeB, recipeC]}

        //delete specific list
		$scope.deleteList= function(listName){
			console.log(listName);
			ListService.deleteList(listName);
			$scope.lists = ListService.lists;
			alert("You successfuly deleted that!")
		}

        //create new List
        $scope.addList = function (listName) {
           var  newList = {};
           newList.name = $scope.listName;
           newList.content = [];
        ListService.addList(newList);
        }

		//show the list detail
		 $scope.showListDetail = function(list){
      	$scope.list = list;
		  $scope.content = list.content;
		  console.log("list.content")
		  console.log(list.content[0]);

    	}

	}]);

//The controllerlet the listDetail page diplays all the recipe in the recipe list
myApp.controller('ListDetailCtrl',["$scope","$stateParams","ListService","$filter", function($scope,$stateParams, ListService, $filter){
	var lists = ListService.lists;
	var targetList = [];
	for(var i = 0; i < lists.length;i++){
		var tempList = lists[i];
		if(tempList.name == $stateParams.list){
			targetList = lists[i];
		}
	}	
	$scope.recipes = targetList.content
	console.log($scope.recipes);

}])

//stored different lists
myApp.factory('ListService', function(){
		var service = {};
		service.lists = [];
		//The defualt list
		var testList = {name:"favorite", content:["pizza","burger","fried chicken"]};
		var testList2 = {name:"asian", content:["fried rice","sushi","loo mein"]};
		service.lists.push(testList);
		service.lists.push(testList2);
			
	
		//add recipe from the detail page to specific list
        //recipe = new recipe object
        //listName = ngModel the name
		service.addRecipe = function(recipe, ListName) {
            var listIndex = 0;
            for(var i = 0; i < service.lists.length; i++){
                var tempList = service.lists[i];
                if(tempList.name == ListName){
                    listIndex = i;
                    service.lists[i].content.push(recipe);
                }
            }
			console.log(service.lists);
	    };

        //add a new List into Lists
        service.addList = function(newlist) {
            service.lists.push(newlist);
			console.log("Add new List");
			console.log(service.lists);
        }

		//delete the list from the lists
		service.deleteList = function(ListName){
            var index = 0;
			 for(var i = 0; i < service.lists.length; i++){
                var tempList = service.lists[i];
                //find which list the user want to delete
                if(tempList.name == ListName){
                    index = 1;
                }
            }
            service.lists.splice(index,1);
	};
		return service;
	});

myApp.controller('detailsCtrl', ['$scope', '$http', 'FireBaseService', function($scope, $http, FireBaseService, $log){
	var id = "Greek-Yoghurt-with-Apple-and-Blackberry-Compote-and-Pistachios-1735728";
	var related;
	$http.get('http://api.yummly.com/v1/api/recipe/' + id + '?_app_id=727f9e61&_app_key=6432cf347203b199cad6e4ccd21ba822')
		.success(function (data) {
			$scope.detail = data;
		related = data.attributes.course[0];
		console.log(related);
		console.log(data);
		$http.get('http://api.yummly.com/v1/api/recipes?_app_id=727f9e61&_app_key=6432cf347203b199cad6e4ccd21ba822&q' + related).success(function(result){
			console.log(result);
			$scope.relateds = result.matches;
		})
	});

	$scope.lists = FireBaseService.lists;

	$scope.addToList = function (foodName, selectedListName) {
		FireBaseService.addRecipe({'name':foodName}, selectedListName);
	};

	$scope.showInput = function(){
		return true;
	};

	$scope.submit = function(newListName){
		console.log(newListName);
		console.log("haha");
		FireBaseService.addList({'name':newListName});
		console.log(FireBaseService.lists);
		$scope.status = {
    		isopen: false
  		};

	};
}]);