var selApp = angular.module('selApp', [])
    .config(function () {
        angular.element(document).bind('keyup', function (e) {
            angular.element(document.getElementById("selektionController")).scope().keyPress(e.keyCode);
        })
    });


selApp.controller('SelektionController', function SelektionController($scope, $http, $timeout) {
    $scope.files = [];
    $scope.actions = [];
    $scope.albums = {};
    var imgIndex = undefined;
    $scope.currentImage = undefined;
    $scope.nextImages = [];
    $scope.imageCollections = 1;

    $http.get('services/' + $scope.imageCollections + '/list').then(function (res) {
        var files = res.data;
        if (files.length > 0) {
            $scope.files = files;
            $timeout(function () {
                $scope.refreshCarrousel(0);
            });
        }
    });

    $http.get('services/' + $scope.imageCollections + '/action').then(function (res) {
        var files = res.data;
        if (files.length > 0) {
            $scope.actions = files;
        }
    });

    $scope.getAlbum = function (albumId) {
        var album = $scope.albums[albumId];
        if (!album) {
            album = [];
            $scope.albums[albumId.toString()] = album;
        }
        return album;
    };

    $scope.setAlbum = function (albumId) {
        var album = $scope.getAlbum(albumId);
        var indexOf = album.indexOf($scope.currentImage);
        if (indexOf >= 0) {
            album.splice(indexOf, 1);
        } else {
            album.push($scope.currentImage);
        }

        $scope.$apply();
    };

    $scope.refreshCarrousel = function (newIndex) {
        if (newIndex !== imgIndex) {
            imgIndex = newIndex;
            $scope.currentImage = $scope.files[imgIndex];
            $scope.nextImages = [];
            for (var i = imgIndex + 1; i < imgIndex + 6 && i < $scope.files.length; i++) {
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
        if (keyCode >= 48 && keyCode <= 57) {
            var album = keyCode - 48;
            $scope.setAlbum(album);
        }
    };

});