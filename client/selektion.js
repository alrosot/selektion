var selApp = angular.module('selApp', [])
    .config(function () {
        angular.element(document).bind('keyup', function (e) {
            angular.element(document.getElementById("selektionController")).scope().keyPress(e.keyCode);
        })
    });


selApp.controller('SelektionController', function SelektionController($scope, $http, $timeout) {
    $scope.files = [];
    var imgIndex = undefined;
    $scope.currentImage = undefined;
    $scope.nextImages = [];

    $http.get('services/list').then(function (res) {
        var files = res.data;
        if (files.length > 0) {
            $scope.files = files;

            $timeout(function () {
                $scope.refreshCarrousel(0);
            });
        }

    });

    $scope.refreshCarrousel = function (newIndex) {
        if (newIndex !== imgIndex) {
            imgIndex = newIndex;
            $scope.currentImage = $scope.files[imgIndex];
            $scope.nextImages = [];
            for (var i = imgIndex+1; i < imgIndex + 6 && i < $scope.files.length;i++) {
                $scope.nextImages.push($scope.files[i]);
            }

            $scope.$apply();
        }
    };

    $scope.goPrevious = function () {
        if (imgIndex > 0) {
            $scope.refreshCarrousel(imgIndex - 1);
        }
    };
    $scope.goNext = function () {
        if (imgIndex < $scope.files.length - 1) {
            $scope.refreshCarrousel(imgIndex + 1);
        }
    };

    $scope.keyPress = function (keyCode) {
        if (keyCode === 37) {
            $scope.goPrevious();
        }
        if (keyCode === 39) {
            $scope.goNext();
        }

    };


});