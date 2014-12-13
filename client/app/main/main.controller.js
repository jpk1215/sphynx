'use strict';

angular.module('sphynxApp')
  .controller('MainCtrl', function ($scope, $http, socket, $state, $modal, data, $log) {

    // $http.get('/api/things').success(function(awesomeThings) {
    //   $scope.awesomeThings = awesomeThings;
    //   socket.syncUpdates('thing', $scope.awesomeThings);
    // });

    $scope.open = function () {

      var modalInstance = $modal.open({
        templateUrl: 'app/main/main.modal.html',
        controller: 'MainCtrl',
        size: 'lg'
      });

      console.log("Asdasdasd");

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    console.log(data.nateObj);

    $scope.dimensions = function(boolean) {
      if(boolean) {
        data.nateObj.twoD = true;
      } else {
        data.nateObj.twoD = false;
      }
    }

    $scope.plotType = function(boolean) {
      if(boolean) {
        data.nateObj.type = 'scatter';
      } else {
        data.nateObj.type = 'histogram';
      }
    }

    $scope.filePick = function() {
      filepicker.setKey("Az7OkUN13Rs6HlHX403ZQz");
      filepicker.pick(function(Blob){
        filepicker.read(Blob, function(rawData){
          data.set(rawData)
          $log.debug(data.nateObj)
          $state.go('parent.view');
        });
      });
    };
  });
