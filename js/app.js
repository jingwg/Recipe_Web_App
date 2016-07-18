
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
					url:'/category',
					templateUrl: 'partials/category.html' 
				})
				 //The order list page 
  				.state('detail', {
					  url:'/detail',
   					 templateUrl: 'partials/detail.html' 
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
				templateUrl: 'partials/signIn.html',//path of the partial to load
			})
			$urlRouterProvider.otherwise('/');
			
}]);

    //add the recipe from the detail controller

    //the list controller, let user interact will all the lists
    myApp.controller('ListCtrl',["$scope","ListService", function($scope, ListService){
		$scope.lists = ListService.lists; // list is an array [list1, list2, list3], list1 = {name:favorite, content: [recipeA, recipeB, recipeC]}

        //delete specific list
		$scope.deleteList= function(){
			ListService.deleteList(listName);
			$scope.lists = ListService.lists;
			alert("You successfuly deleted that!")
		}
		
        //delete specific recipe object
		$scope.removeRecipe = function(recipe){
		    //find the list 
            //find that recipe and then delete			
		};

        //create new ListCtrl
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

//stored different lists
myApp.factory('ListService', function(){
		var service = {};
		service.lists = [];
		//just for testing
		var exmapleRecipe = {name:"pizza",ingredients:["bananas","cocoa powder","peanut butter","almond milk"]};
		var testList = {name:"favorite", content:[exmapleRecipe]};
		service.lists.push(testList);
		console.log(service.lists);
			
	
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

        //add a new List 
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

myApp.controller('detailsCtrl', ['$scope', '$http', 'ListService', function($scope, $http, ListService){
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
			$scope.relateds = result.matches;
		})
	});
	$scope.lists = [
      {name:'list1', shade:'dark'},
      {name:'list2', shade:'light'},
      {name:'list3', shade:'dark'},
      {name:'list4', shade:'dark'},
      {name:'list5', shade:'light'}
    ];
    $scope.myLists = $scope.lists[2];
	//$scope.data = result;
	console.log(related);
	//var related = result.course[0];
	//console.log(related);
	// $http.get('http://api.yummly.com/v1/api/recipes?_app_id=727f9e61&_app_key=6432cf347203b199cad6e4ccd21ba822' + )

	// $scope.data = {
	// 	availableOptions: [
	// 	{id: '1', name: 'Option A'},
	// 	{id: '2', name: 'Option B'},
	// 	{id: '3', name: 'Option C'}
	// 	],
	// 	selectedOption: {id: '3', name: 'Option C'} //This sets the default value of the select in the ui
    // };

	

	$scope.addToList = function (detail, myName) {
		
		var recipeName = detail.name;
		var selectedListName = $scope.myLists.name;
		//ListService.addRecipe("test", "list1");
		console.log(selectedListName);
		console.log(ListService.lists)
	};

}]);