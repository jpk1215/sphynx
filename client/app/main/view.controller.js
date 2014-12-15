'use strict';

angular.module('sphynxApp')
  .controller('ViewCtrl', function ($scope, $http, data) {
     var createFileAndRender = function() {
      $http.post('/api/things/createHTML', data.nateObj)
           .success(function(data, status, headers, config) {
              $scope.fileStr = data.fileStr;
              var createdHTML = "<object style='width: 100%; height: 800px;'" +
                         " data='api/things/"+data._id+"'></object>";

              $('.rendered-graph').append(createdHTML);
           });
     };

     createFileAndRender();
     // var createdHTML = "<object style='width: 100%; height: 700px;'" +
     //                     " data='nat.html'></object>";

     //          $('.rendered-graph').append(createdHTML);
  });
