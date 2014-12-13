// plot types:
// 2d: scatter, histogram
// 3d: 3dPlot



var makeBostock = function(nateObj){
//SELECT GET FUNCTIONS BASED ON USER INPUT
  if (nateObj.twoD){
    if (nateObj.type === 'histogram'){
      return twoDStart() + getStart() + getHisto() + getFunCall(nateObj) + twoDClose();
    }
    // if (type === 'line'){
    //   return twoDStart() + getStart() + getLine() + getFunCall() + twoDClose();
    // }
    if (nateObj.type === 'scatter'){
      return twoDStart() + getStart() + getScatter() + getFunCall(nateObj) + twoDClose();
    }
    else {
      return '';
    }
  }
}

//GET STRING FUNCTIONS

  var twoDStart = function(){
    var string = "<html>\n  <head>\n    <script src=\"http:\/\/d3js.org\/d3.v3.min.js\" charset=\"utf-8\"><\/script>\n    <style type=\"text\/css\">\n      svg path, svg line{\n        fill:none;\n        stroke:black;\n      }\n      svg text {\n        font-family: sans-serif;\n        font-size: 11px;\n      }\n    <\/style>\n  <\/head>\n  <body><\/body>\n  <script type=\"text\/javascript\">\n\n  ";
    return string;

  }
  var twoDClose = function(){
    var string = '</script></html>';
    return string;
  }

  var getFunCall = function(nateObj){
      if (nateObj.type === 'scatter' || nateObj.type === 'bubble'){
        var labels = ['xLab','yLab','sizeLab'];
        var string = '';

        delete nateObj.pointLabels;
        delete nateObj.type;
        delete nateObj.twoD;

        var keys = Object.keys(nateObj);
        //defines variables
        var labelString = "";
        var callString = "";
        keys.forEach(function(key,i){
            string += 'var '+key+'= ['+nateObj[key]+"]; \n";
            labelString += labels[i] +": "+"'"+key+"'" +", ";
            if (i < 2) callString += key+',';
        });
        var sizeString = "";
        if (keys.length === 3){
            sizeString += "size: ["+nateObj[keys[2]]+"]";
        }
        string += "var config = {" + labelString + sizeString +"};\n";
        string += "scatter("+callString+"config)";
        return string
      }
      //histo
      if (nateObj.type === 'histogram'){
        var labels = ['xLab'];
        var string = '';

        delete nateObj.pointLabels;
        delete nateObj.type;
        delete nateObj.twoD;

        var key = Object.keys(nateObj)[0];
        string += 'var '+key+'= ['+nateObj[key]+"]; \n";
        string += "var config = {xLab: " +"'"+ key+"'"+ "};\n";
        string += "histo("+key+", config);";
        return string;
      }
  }

  var getStart = function(){
    var string = "var start = function(xLab,yLab,xMap,yMap,canvasWidth,canvasHeight,width,height,selector){\n\n    var canvas = d3.select(selector)\n                  .append(\'svg\')\n                  .attr(\'height\',canvasHeight)\n                  .attr(\'width\', canvasWidth);\n\n    var everything = canvas.append(\'g\');\n\n    everything.attr(\'transform\',\'translate(\'+(width * 0.2)+\',\'+height*0.1+\')\');\n\n    var xAxis = d3.svg.axis()\n                .scale(xMap);\n\n    var yAxis = d3.svg.axis()\n                .scale(yMap)\n                .orient(\'left\');\n\n    everything.append(\'g\')\n          .attr(\'transform\',\'translate(0,\'+height+\')\')\n          .call(xAxis);\n\n    everything.append(\'g\')\n          .call(yAxis);\n\n    var xLabel = everything.append(\'text\')\n                .attr(\'x\',canvasWidth*0.4)\n                .attr(\'y\',height+45)\n                .text(xLab)\n                .attr(\'text-anchor\',\'middle\');\n\n    var yLabel = everything.append(\'text\')\n                .attr(\'x\', -canvasHeight*0.4)\n                .attr(\'y\', -canvasWidth*0.1)\n                .attr(\'transform\',\'rotate(-90)\')\n                .text(yLab)\n                .attr(\'text-anchor\',\'middle\');\n\n    var objects = [canvas,everything];\n    return objects;\n\n  }\n  \/\/ END OF START FUNCTION\n\n\n  ";
    return string;
  };

  var getHisto = function(){
    var string = "\/\/ HISTO FUNCTION: creates histogram plot\n  histo = function(data,config){\n    if (typeof config === \'undefined\'){config = {}};\n    var xLab=config.xLab,selector=config.selector,canvasWidth=config.width,canvasHeight=config.height;\n\n    if(typeof canvasWidth === \'undefined\'){\n      canvasWidth = 500;\n    }\n    if(typeof canvasHeight === \'undefined\'){\n      canvasHeight = 500;\n    }\n    if(typeof selector === \'undefined\'){\n      selector = \'body\';\n    }\n    if(typeof xLab === \'undefined\'){\n      xLab = \'\';\n    }\n\n    var hist = function(arr){\n      var newArr = arr.slice().sort(function(a,b){\n          return a-b;\n      });\n\n      var max = newArr[arr.length -1];\n      var min = newArr[0];\n      var bins = Math.round(Math.sqrt(arr.length));\n      var binSize = (max-min)\/bins;\n\n      var obj= {};\n      var keys = [];\n      for (var i=0; i<bins; i++){\n          var key = min + (i*binSize);\n          keys.push(key);\n          obj[key] = 0;\n      }\n\n      for (var j=0; j<arr.length; j++){\n          var val = min;\n          var temp_key = 0;\n          while(true){\n              if (newArr[j] == newArr[newArr.length-1]){\n                  obj[keys[keys.length-1]] += 1;\n                  break;\n              }\n              else if (newArr[j]<val+binSize){\n                  obj[keys[temp_key]]+= 1;\n                  break;\n              }\n              else{\n                  temp_key += 1;\n                  val += binSize;\n              }\n          }\n      }\n\n        return [obj,min,max,binSize];\n    };\n\n    var height = canvasHeight\/1.3;\n    var width = canvasWidth\/1.3;\n    if (canvasHeight - height < 75){height -= 45};\n\n    var allData = hist(data);\n\n    var xMap = d3.scale.linear()\n                    .domain([allData[1],allData[2]])\n                    .range([0,width]);\n\n    var maxfreq = Math.max.apply( null,Object.keys(allData[0]).map(function ( key ) { return allData[0][key]; }) );\n\n    var yMap = d3.scale.linear()\n                    .domain([maxfreq,0])\n                    .range([0,height]);\n\n    var objects = start(xLab,\'Frequency\',xMap,yMap,canvasWidth,canvasHeight,width,height,selector);\n\n    var canvas = objects[0];\n    var everything = objects[1];\n\n    \/\/MAKE AN ARRAY OF THE DATA TO BIND\n    var obj = allData[0];\n    var keys = Object.keys(obj);\n    var arr = [];\n    for (var i=0;i<keys.length;i++){\n        arr.push(obj[keys[i]]);\n    }\n\n    \/\/ obj,min,max,binSize\n    var binSize = xMap(allData[3] + allData[1]);\n    var padding = binSize * 0.075;\n    \/\/padding used to create a buffer around each bin\n\n    everything.selectAll(\'rect\')\n          .data(arr)\n          .enter()\n          .append(\'rect\')\n          .attr(\'x\', function(d,index){\n            return (index*binSize + padding\/2);\n          })\n          .attr(\'y\', function(d){\n            return yMap(d);\n          })\n          .attr(\'height\', function(d){\n            return Math.max(yMap(maxfreq - d) - 0.5, 0);\n          })\n          .attr(\'width\', binSize-padding)\n          .style(\'fill\', \'steelBlue\');\n\n    return canvas;\n  };\n  \/\/ END OF HIST FUNCTION\n";

    return string;
  }

// var getLine = function(){
//   var string = "// BEGINNING OF XY PLOT FUNCTION
//   xyPlot = function(x,y,config){
//     if (typeof config === 'undefined'){config = {}};
//     var xLab=config.xLab,yLab=config.yLab,selector=config.selector,canvasWidth=config.width,canvasHeight=config.height;

//     if(typeof canvasWidth === 'undefined'){
//       canvasWidth = 500;
//     }
//     if(typeof canvasHeight === 'undefined'){
//       canvasHeight = 500;
//     }
//     if(typeof selector === 'undefined'){
//       selector = 'body';
//     }

//     var xSort = x.slice().sort(function(a,b){
//         return a-b;
//     });

//     var ySort = y.slice().sort(function(a,b){
//         return a-b;
//     });
//     var yMax = ySort[ySort.length-1];
//     var yMin = ySort[0];


//     var height = canvasHeight/1.3;
//     var width = canvasWidth/1.3;
//     if (canvasHeight - height < 75){height -= 45};

//     if (typeof x[0] !== 'number'){
//       if (typeof Date.parse(x[0]) === 'number'){
//         // if we're here, x[0] is a date
//         var xMap = d3.time.scale()
//                         .domain([new Date(x[0]),new Date(x[x.length-1])])
//                         .range([0,width]);
//         x.forEach(function(element,index){
//           x[index] = new Date(x[index]);
//         });
//       }
//     }
//     else{
//       // boundaries for numeric x
//       var xMax = xSort[xSort.length-1];
//       var xMin = xSort[0];

//       var xMap = d3.scale.linear()
//                       .domain([xMin,xMax])
//                       .range([0,width]);
//     }

//     var yMap = d3.scale.linear()
//                     .domain([yMax,yMin])
//                     .range([0,height]);

//     var objects = start(xLab,yLab,xMap,yMap,canvasWidth,canvasHeight,width,height,selector);

//     var canvas = objects[0];
//     var everything = objects[1];

//     for (var i=1;i<x.length;i++){
//       everything.append('line')
//                 .attr('stroke-width',1)
//                 .attr('stroke','black')
//                 .attr('x1',xMap(x[i-1]))
//                 .attr('x2',xMap(x[i]))
//                 .attr('y1',yMap(y[i-1]))
//                 .attr('y2',yMap(y[i]));
//     }

//     return canvas;

//   };


//   ";

//   return string;
// };

  var getScatter = function(){
    var string = "\/\/ START OF SCATTER FUNCTION\n  scatter = function(x,y,config){\n    if (typeof config === \'undefined\'){config = {}};\n    var xLab=config.xLab,yLab=config.yLab,selector=config.selector,canvasWidth=config.width,canvasHeight=config.height,z=config.size,zLab=config.sizeLab;\n\n    if(typeof canvasWidth === \'undefined\'){\n      canvasWidth = 500;\n    }\n    if(typeof canvasHeight === \'undefined\'){\n      canvasHeight = 500;\n    }\n    if(typeof selector === \'undefined\'){\n      selector = \'body\';\n    }\n\n    var xSort = x.slice().sort(function(a,b){\n          return a-b;\n    });\n\n    var ySort = y.slice().sort(function(a,b){\n          return a-b;\n      });\n\n    if (typeof z !== \'undefined\'){\n      var zSort = z.slice().sort(function(a,b){\n            return a-b;\n      });\n    }\n\n    var yMax = ySort[ySort.length-1];\n    var yMin = ySort[0];\n\n    var height = canvasHeight\/1.3;\n    var width = canvasWidth\/1.3;\n    if (canvasHeight - height < 75){height -= 45};\n\n    if (typeof x[0] !== \'number\'){\n      if (typeof Date.parse(x[0]) === \'number\'){\n        \/\/ if we\'re here, x[0] is a date\n        var xMap = d3.time.scale()\n                        .domain([new Date(x[0]),new Date(x[x.length-1])])\n                        .range([0,width]);\n        x.forEach(function(element,index){\n          x[index] = new Date(x[index]);\n        });\n      }\n    }\n    else{\n      \/\/ boundaries for numeric x\n      var xMax = xSort[xSort.length-1];\n      var xMin = xSort[0];\n\n      var xMap = d3.scale.linear()\n                      .domain([xMin,xMax])\n                      .range([0,width]);\n    }\n\n    var yMap = d3.scale.linear()\n                    .domain([yMax,yMin])\n                    .range([0,height]);\n\n    if (typeof zLab !== \'undefined\'){yLab = yLab+\' (\'+zLab+\')\'};\n    var objects = start(xLab,yLab,xMap,yMap,canvasWidth,canvasHeight,width,height,selector);\n\n    var canvas = objects[0];\n    var everything = objects[1];\n\n\n    x.forEach(function(elem,index){\n      everything.append(\'circle\')\n                .attr(\'r\',function(){\n                  if (typeof z === \'undefined\'){\n                    return height*width*(0.00002);\n                  }\n                  else{\n                    return (height*width*0.000025 + (z[index]-zSort[0])*(height*width*(0.0001))\/(zSort[zSort.length-1] - zSort[0]));\n                  }\n                })\n                .attr(\'cx\',xMap(x[index]))\n                .attr(\'cy\',yMap(y[index]))\n                .attr(\'opacity\',function(){\n                  if (typeof z === \'undefined\'){\n                    return 1;\n                  }\n                  else{\n                    return 0.3;\n                  }\n                })\n                .attr(\'fill\',function(){\n                  if (typeof z === \'undefined\'){\n                    return \'none\';\n                  }\n                  else{\n                    return \'steelBlue\';\n                  }\n                })\n                .attr(\'stroke\', function(){\n                  if (typeof z === \'undefined\'){return\'black\'};\n                  return \'none\'\n                });\n    });\n\n    return canvas;\n\n  }\n\n  ";

    return string;
  };

var nateObj = {
  type: 'histogram',
  twoD: true,
  pointLabels:[],
  independent: [1,2,3,4,5,12,43,32,22],
}

//makeBostock(nateObj)
 console.log(makeBostock(nateObj));
