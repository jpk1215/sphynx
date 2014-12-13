'use strict';

angular.module('sphynxApp')
  .controller('MainCtrl', function ($scope, $http, socket, $state, $modal, data, $log) {

    $scope.filePick = function (type, twoD) {
      filepicker.setKey('Az7OkUN13Rs6HlHX403ZQz');
      filepicker.pick(function(Blob){
        filepicker.read(Blob, function(rawData){
          data.set(rawData, type, twoD);
          $log.debug(data.nateObj);
          $state.go('parent.view');
        });
      });
    };
  });
