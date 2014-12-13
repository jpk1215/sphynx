'use strict';

angular.module('sphynxApp')
  .controller('MainCtrl', function ($scope, $http, socket, $modal, $log) {

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

    $scope.dimensions = function(boolean) {
      $scope.twoD = boolean ? true : false;
    };

    $scope.plotType = function(boolean) {
      $scope.type = boolean ? 'scatter' : 'histogram';
    };

    function transpose(arr) {
      var transposed = [];
      var i, ii, j, jj;
      for (i = 0, ii = arr[0].length; i < ii; i++) {
        transposed.push([]);
      }
      for (i = 0, ii = arr.length; i < ii; i++) {
        for (j = 0, jj = arr[i].length; j < jj; j++) {
          transposed[j][i] = arr[i][j];
        }
      }
      return transposed;
    }

    function clean2D (arr) {
      var clean = [];
      for (var i = 0, ii = arr.length; i < ii; i++) {
        var temp = [];
        for (var j = 0, jj = arr[i].length; j < jj; j++) {
          if ( arr[i][j].trim().length > 0 ) {
            temp.push(arr[i][j].trim());
          }
        }
        if ( temp.length > 0 ) {
          clean.push(temp);
        }
      }
      return clean;
    }

    function makeNate (arr) {
      var nonNum = /\D/;
      var pointLabelFlag = false;
      var axisHash = {
        '0' : 'x',
        '1' : 'y',
        '2' : 'z',
        '3' : 'size',
        '4' : 'color'
      };
      var nateObj = {
        type: $scope.type,
        twoD: true,
        pointLabels: []
      };
      if ( $scope.twoD ) {
        nateObj.twoD = $scope.twoD;
      }
      for (var i = 0, ii = arr.length; i < ii; i++) {
        var count = 0;
        for (var j = 0, jj = arr[i].length; j < jj; j++) {
          if(arr[i][j].match(nonNum)) {
            count++;
          }
        }
        if (count > 1) {
          nateObj.pointLabels = arr[i];
          pointLabelFlag = true;
        } else if (count === 1) {
          var axisKey = arr[i].shift();
          nateObj[axisKey] = arr[i];
        } else {
          var k = i;
          if ( pointLabelFlag ) {
            k = i-1;
          }
          nateObj[axisHash[k]] = arr[i];
        }
      }
      return nateObj;
    }

    $scope.filePick = function() {
      filepicker.setKey('Az7OkUN13Rs6HlHX403ZQz');
      filepicker.pick( function (Blob) {
        filepicker.read( Blob, function (data) {
          var graphObj = makeNate(clean2D(transpose(Papa.parse(data).data)));
          $log.debug('transposed and cleaned: ', graphObj);
        });
      });
    };

    // $scope.$on('$destroy', function () {
    //   socket.unsyncUpdates('thing');
    // });
  });
