'use strict';

angular.module('sphynxApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.filePick = function() {
      filepicker.setKey("Az7OkUN13Rs6HlHX403ZQz");

      filepicker.pick(function(Blob){
        filepicker.read(Blob, function(data){
          console.log(Papa.parse(data))
        })
      })
    }

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
  });
