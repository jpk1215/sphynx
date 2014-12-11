'use strict';

angular.module('sphynxApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    function transpose(arr) {
      var transposed = [];
      for (var i = 0, ii = arr[0].length; i < ii; i++) {
        transposed.push([]);
      };
      for (var i = 0, ii = arr.length; i < ii; i++) {
        for (var j = 0, jj = arr[i].length; j < jj; j++) {
          transposed[j][i] = arr[i][j];
        }
      }
      return transposed;
    }

    function clean2D (arr) {
      var clean = [];
      for (var i = 0, ii = arr.length; i < ii; i++) {
        var temp = [];
        for (var j = 0, jj= arr[i].length; j < jj; j++) {
          if(arr[i][j].trim().length > 0) {
            temp.push(arr[i][j].trim());
          }
        }
        if(temp.length > 0){
          clean.push(temp);
        }
      }
      return clean;
    }

    function makeBostock (arr) {
      var bostockObj = {};
      var noNums = /\D/;
      for (var i = 0; i < arr.length; i++) {
        
      };
    } 

    $scope.filePick = function() {
      filepicker.setKey("Az7OkUN13Rs6HlHX403ZQz");
      filepicker.pick(function(Blob){
        filepicker.read(Blob, function(data){
          var myArr = clean2D(transpose(Papa.parse(data).data));
          console.log(myArr);   
        });
      })
    }

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
  });
