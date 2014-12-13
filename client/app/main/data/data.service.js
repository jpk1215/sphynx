'use strict';

angular.module('sphynxApp')
  .factory('data', function () {

    // default initialization
    var nateObj = {
      type: 'histogram',
      twoD: true,
      pointLabels: []
    };

    function transpose (arr) {
      var transposed = [];
      var i, ii;
      for (i = 0, ii = arr[0].length; i < ii; i++) {
        transposed.push([]);
      }
      for (i = 0, ii = arr.length; i < ii; i++) {
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

    function makeNate (arr) {
      var nonNum = /\D/;
      var pointLabelFlag = false;
      var axisHash = {
        '0' : 'X',
        '1' : 'Y',
        '2' : 'Z',
        '3' : 'size',
        '4' : 'color'
      };
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
          if (pointLabelFlag) {
            k = i-1;
          }
          nateObj[axisHash[k]] = arr[i];
        }
      }
      return nateObj;
    }

    function set (rawData, type, twoD) {
      nateObj.type = type || 'histogram';
      nateObj.twoD = twoD || true;
      return makeNate(clean2D(transpose(Papa.parse(rawData).data)));
    }

    // Public API here
    return {
      nateObj: nateObj,
      set: set
    };
  });
