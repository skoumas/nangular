var apiurl = "http://localhost:1337/";
var nangular = angular.module("nangular", ['ngRoute', 'ui.bootstrap','angularFileUpload']);

//routing
nangular.config(function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'pages/myPhotos.html',
    pageTitle: "My Photos",
    controller: "myPhotos"
  })
    .when('/about', {
    templateUrl: 'pages/about.html',
    pageTitle: "About",
    controller: "staticPage"
  })
    .otherwise({
    redirectTo: '/'
  });

});


nangular.controller("navController", function($scope, $location)
{
  $scope.isActive = function(viewLocation) {
    return viewLocation === $location.path();
  };
});


  
nangular.controller('uploadForm', ['$scope','$rootScope','$timeout', 'FileUploader','photos',  
 function($scope,$rootScope,$timeout, FileUploader,photos  ) {


$scope.close = function(size) 
  {
    
    $rootScope.modalInstance.ok();
  };

        var uploader = $scope.uploader = new FileUploader({
            url: 'http://localhost:1337/photo/upload'
        });

        // FILTERS

        uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

        // CALLBACKS

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            $scope.uploadDisplay = "Only images please";
        };
        uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) { 
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            
        };
        uploader.onCompleteAll = function(response) {  
             
          photos.getPhotos().then(function(d) { 
            $rootScope.photos = d;     
          })

           ($rootScope.modalInstance.dismiss());
        };

 
 
    }]);
 

nangular.controller('uploadModal', function($scope,$rootScope, $modal, $log,$http) {
 
  $scope.open = function(size) 
  {

 

       $http(
       {
          method: "post",
          url: apiurl + "photo/upload"  
        })
       .then(
        function (response) 
        {
          $rootScope.modalInstance = $modal.open(
          {
            templateUrl: 'pages/upload.html', 
            controller: 'ModalInstanceCtrl',
            backdrop: true,
            size: size 
          });
        },
        function (error) 
        {  
          $rootScope.modalInstance = $modal.open(
          {
            templateUrl: 'pages/error.html', 
            backdrop: true,
            size: size 
          });
        });

};

});


nangular.controller('ModalInstanceCtrl', function ($scope, $modalInstance) {

   

  $scope.ok = function () {
    $modalInstance.close( );
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

  
nangular.controller("staticPage", function($scope) 
{
 
});
 

nangular.controller("myPhotos", function($rootScope, photos)
{
 
  photos.getPhotos().then(function(d) {
    $rootScope.photos = d;  
  });

  $rootScope.getPhoto = function(id) {
    photos.getPhoto(id).then(function(d) {
      $rootScope.photoDetails = d;
    });
  }

});




nangular.factory('photos', function($http) {
  var promise;
  var photoDetails;
  var photos = {

    getPhoto: function(id) {
 
      photoDetails = $http({

        method: "post",
        url: apiurl + "photos/list/" + id + "/details"
      })
        .then(function(response) {
        return response.data;
      });

      return photoDetails;
 
    },
 
    getPhotos: function() { 
      if (1) { 
        promise = $http({
          method: "post",
          url: apiurl + "photos/list"
        })
          .then(function(response) {
          return response.data;
        });

      }
      return promise;
    }
 
  };
  return photos;
});
 



nangular.directive("photothumb", function() {
  return {
    templateUrl: "pages/directives/photothumb.html"
  }

});

nangular.directive('ngThumb', ['$window', function($window) {
        var helper = {
            support: !!($window.FileReader && $window.CanvasRenderingContext2D),
            isFile: function(item) {
                return angular.isObject(item) && item instanceof $window.File;
            },
            isImage: function(file) {
                var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        };

        return {
            restrict: 'A',
            template: '<canvas/>',
            link: function(scope, element, attributes) {
                if (!helper.support) return;

                var params = scope.$eval(attributes.ngThumb);

                if (!helper.isFile(params.file)) return;
                if (!helper.isImage(params.file)) return;

                var canvas = element.find('canvas');
                var reader = new FileReader();

                reader.onload = onLoadFile;
                reader.readAsDataURL(params.file);

                function onLoadFile(event) {
                    var img = new Image();
                    img.onload = onLoadImage;
                    img.src = event.target.result;
                }

                function onLoadImage() {
                    var width = params.width || this.width / this.height * params.height;
                    var height = params.height || this.height / this.width * params.width;
                    canvas.attr({ width: width, height: height });
                    canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
                }
            }
        };
    }]);



 