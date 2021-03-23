var backstageApp = angular.module('backOfficeApp', ['base64', 'ui.bootstrap']);
backstageApp.config(function($httpProvider, $base64) {
        var auth = $base64.encode("admin:adminPassword");
        $httpProvider.defaults.headers.common['Authorization'] = 'Basic ' + auth;
});
backstageApp.controller('categoryController', function($scope, $http) {

    $scope.serverUrl = "http://localhost:8080/categories/";

    $scope.curPage = 1;
    $scope.pageSize = 3;
    $scope.numPages = null;
    $scope.totalItems = null;

    $scope.editingId = 0;

    $scope.setDisabled = function(category) {
        return !(category.id === $scope.editingId)
    };

    $scope.setEditingId = function(category) {
        if($scope.editingId === 0) {
            $scope.editingId = category.id;
        } else {
            $scope.editingId = 0;
        }
    };

    $scope.setPage = function (pageNo) {
        $scope.curPage = pageNo;
    };

    $scope.pageChanged = function() {
        $scope.loadData();
    };


    $scope.loadData = function() {
        $http({method: 'GET', url: "http://localhost:8080/categories",
            params:{page : $scope.curPage - 1, size: $scope.pageSize}}).
        then(function success(response) {
            $scope.categoryList = response.data.content;
            $scope.numPages = response.data.page.totalPages;
            $scope.totalItems = response.data.page.totalElements;
        });
    };

    $scope.findById = function(catId) {
        if (catId != null) {
            return $http({method: 'GET', url: $scope.serverUrl + catId});
        }
    };

    $scope.findByName = function(categoryName) {
        $scope.foundedSubCategory = null;
        $scope.foundedSuperCategory = null;
        $http({method: 'GET', url: $scope.serverUrl + 'name/' + categoryName} ).
        then(function success(response) {
            $scope.foundedCategory = response.data;
            $scope.findById($scope.foundedCategory.subCategoryId).then(function success(response) {
                $scope.foundedSubCategory = response.data;
            });
            $scope.findById($scope.foundedCategory.superCategoryId).then(function success(response) {
                $scope.foundedSuperCategory = response.data;
            });
        });
    };



    $scope.saveCategory = function(category) {
        $http.post($scope.serverUrl, category).
        then(function success(response) {
            $scope.loadData();
            category.name = null;
            category.subCategoryId = null;
            category.superCategoryId = null;
        });
    };

    $scope.updateCategory = function(category) {
        $http.put($scope.serverUrl + category.id, category).
        then(function success(response) {
            $scope.loadData();
            $scope.editingId = 0;
        });
    };

    $scope.deleteCategory = function(category) {
        $http.delete($scope.serverUrl + category.id, category).
        then(function success(response) {
            $scope.loadData();
        });
    };


    $scope.loadData();

});