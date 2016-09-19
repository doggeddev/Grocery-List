/**
 * Created by Richard Drexel on 9/18/2016.
 */


var app = angular.module('groceryListapp', ["ngRoute"]);

app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "views/GroceryList.html",
            controller: "GroceryListController"
        })

        .when("/inputitem", {
            templateUrl: "views/inputitem.html",
            controller: "GroceryListController"
        })

        .when("/inputitem/edit/:id", {
            templateUrl: "views/inputitem.html",
            controller: "GroceryListController"
        })

        .otherwise({
            redirectTo: "/"
        })
});

app.service("GroceryService", function () {
    var groceryService = {};

    groceryService.groceryItems = [
        {id: 1, completed: false, itemName: 'milk', date: new Date()},
        {id: 2, completed: false, itemName: 'cookies', date: new Date()},
        {id: 3, completed: false, itemName: 'bread', date: new Date()},
        {id: 4, completed: false, itemName: 'eggs', date: new Date()},
        {id: 5, completed: false, itemName: 'cheese', date: new Date()},
        {id: 6, completed: false, itemName: 'tea', date: new Date()},
        {id: 7, completed: false, itemName: 'toilet paper', date: new Date()},
        {id: 8, completed: false, itemName: 'apples', date: new Date()},
        {id: 9, completed: false, itemName: 'Cheerios', date: new Date()}
    ];

    groceryService.markCompleted = function (entry) {
        entry.completed = !entry.completed;
    };


    groceryService.getItemByID = function (id) {
        for (var anItem in groceryService.groceryItems) {
            if (groceryService.groceryItems[anItem].id === id)
                return groceryService.groceryItems[anItem];
        }
    };

    groceryService.getNewID = function () {
        if (groceryService.newID) {
            groceryService.newID++;
            return groceryService.newID;
        } else {
            var maxID = _.max(groceryService.groceryItems, function (entry) {
                return entry.id;
            });
            groceryService.newID = maxID.id + 1;
            console.log(groceryService.newID);
            return groceryService.newID;

        }
    };

    groceryService.removeItem = function (entry) {
        var index = groceryService.groceryItems.indexOf(entry);
        groceryService.groceryItems.splice(index, 1);
    };

    groceryService.save = function (itemEntry) {

        var updatedItem = groceryService.getItemByID(itemEntry.id);

        if (updatedItem) {
            updatedItem.completed = itemEntry.completed;
            updatedItem.itemName = itemEntry.itemName;
            updatedItem.date = itemEntry.date;
        } else {
            itemEntry.id = groceryService.getNewID();
            groceryService.groceryItems.push(itemEntry);
        }
    };

    return groceryService;
});

app.controller("HomeController", ["$scope", function ($scope) {
    $scope.appTitle = "Grocery List";
}]);

app.controller("GroceryListController", ["$scope", "$routeParams", "GroceryService", "$location", function ($scope, $routeParams, GroceryService, $location) {

    $scope.Items = GroceryService.groceryItems;


    $scope.markCompleted = function (entry) {
        GroceryService.markCompleted(entry);
    };


    $scope.removeItem = function (entry) {
        GroceryService.removeItem(entry);
    };

    if (!$routeParams.id) {
        $scope.Item = {id: 0, completed: true, itemName: "", date: new Date()};
    } else {
        $scope.Item = _.clone(GroceryService.getItemByID(parseInt($routeParams.id)));
    }


    $scope.save = function () {
        GroceryService.save($scope.Item);
        $location.path("/");
    };
}]);

app.directive("rjdGroceryItem", function () {
    return {
        restrict: "E",
        templateUrl: "views/groceryItem.html"
    }
});