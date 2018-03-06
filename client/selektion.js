function getFileNameFromHttpResponse(httpResponse) {
    var contentDispositionHeader = httpResponse.headers('Content-Disposition');
    var result = contentDispositionHeader.split(';')[1].trim().split('=')[1];
    return result.replace(/"/g, '');
}


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
    $scope.imageCollection = -1;
    $scope.imageCollections = [];

    $http.get('services/collections').then(function (res) {
        $scope.imageCollections = res.data;
    });

    $scope.changeCollection = function () {
        $http.get('services/' + $scope.imageCollection + '/list').then(function (res) {
            var files = res.data;
            if (files.length > 0) {
                $scope.files = files;
                $timeout(function () {
                    $scope.refreshCarrousel(0);
                });
            }
        });

        $http.get('services/' + $scope.imageCollection + '/action').then(function (res) {
            var files = res.data;
            if (files.length > 0) {
                $scope.actions = files;
            }
        });
    };

    $scope.getAlbum = function (albumId) {
        var album = $scope.albums[albumId];
        if (!album) {
            album = [];
            $scope.albums[albumId.toString()] = album;
        }
        return album;
    };

    $scope.executeAction = function (albumId, action) {
        $http({
            url: '/services/' + $scope.imageCollection + '/action/' + action,
            method: 'POST',
            responseType: 'arraybuffer',
            data: {
                'selected': $scope.albums[albumId.toString()]
            },
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/zip, application/octet-stream'
            }
        }).then(function (res) {
            let contentType = res.headers('Content-Type');

            var blob = new Blob([res.data], {
                type: contentType
            });
            saveAs(blob, getFileNameFromHttpResponse(res));
        }, function () {
            //Some error log
        });
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