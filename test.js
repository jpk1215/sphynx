var start = function(xLab,yLab,xMap,yMap,canvasWidth,canvasHeight,width,height,selector) {

  var canvas = d3.select(selector)
                .append('svg')
                .attr('height',canvasHeight)
                .attr('width', canvasWidth);

  var everything = canvas.append('g');

  everything.attr('transform','translate('+(width * 0.2)+','+height*0.1+')');

  var xAxis = d3.svg.axis()
              .scale(xMap);

  var yAxis = d3.svg.axis()
              .scale(yMap)
              .orient('left');

  everything.append('g')
        .attr('transform','translate(0,'+height+')')
        .call(xAxis);

  everything.append('g')
        .call(yAxis);

  var xLabel = everything.append('text')
              .attr('x',canvasWidth*0.4)
              .attr('y',height+45)
              .text(xLab)
              .attr('text-anchor','middle');

  var yLabel = everything.append('text')
              .attr('x', -canvasHeight*0.4)
              .attr('y', -canvasWidth*0.1)
              .attr('transform','rotate(-90)')
              .text(yLab)
              .attr('text-anchor','middle');

  var objects = [canvas,everything];
  return objects;

};

scatter = function(x,y,config) {
  if (typeof config === 'undefined'){
    config = {};
  }

  var xLab=config.xLab,yLab=config.yLab,selector=config.selector,canvasWidth=config.width,canvasHeight=config.height,z=config.size,zLab=config.sizeLab;

  if(typeof canvasWidth === 'undefined'){
    canvasWidth = 500;
  }
  if(typeof canvasHeight === 'undefined'){
    canvasHeight = 500;
  }
  if(typeof selector === 'undefined'){
    selector = 'body';
  }

  var xSort = x.slice().sort(function(a,b){
        return a-b;
  });

  var ySort = y.slice().sort(function(a,b){
        return a-b;
    });

  if (typeof z !== 'undefined'){
    var zSort = z.slice().sort(function(a,b){
          return a-b;
    });
  }

  var yMax = ySort[ySort.length-1];
  var yMin = ySort[0];

  var height = canvasHeight/1.3;
  var width = canvasWidth/1.3;
  if (canvasHeight - height < 75){height -= 45};

  if (typeof x[0] !== 'number'){
    if (typeof Date.parse(x[0]) === 'number'){

      var xMap = d3.time.scale()
                      .domain([new Date(x[0]),new Date(x[x.length-1])])
                      .range([0,width]);
      x.forEach(function(element,index){
        x[index] = new Date(x[index]);
      });
    }
  }
  else{

    var xMax = xSort[xSort.length-1];
    var xMin = xSort[0];

    var xMap = d3.scale.linear()
                    .domain([xMin,xMax])
                    .range([0,width]);
  }

  var yMap = d3.scale.linear()
                  .domain([yMax,yMin])
                  .range([0,height]);

  if (typeof zLab !== 'undefined'){yLab = yLab+' ('+zLab+')';};
  var objects = start(xLab,yLab,xMap,yMap,canvasWidth,canvasHeight,width,height,selector);

  var canvas = objects[0];
  var everything = objects[1];


  x.forEach(function(elem,index){
    everything.append('circle')
              .attr('r',function(){
                if (typeof z === 'undefined'){
                  return height*width*(0.00002);
                }
                else{
                  return (height*width*0.000025 + (z[index]-zSort[0])*(height*width*(0.0001))/(zSort[zSort.length-1] - zSort[0]));
                }
              })
              .attr('cx',xMap(x[index]))
              .attr('cy',yMap(y[index]))
              .attr('opacity',function(){
                if (typeof z === 'undefined'){
                  return 1;
                }
                else{
                  return 0.3;
                }
              })
              .attr('fill',function(){
                if (typeof z === 'undefined'){
                  return 'none';
                }
                else{
                  return 'steelBlue';
                }
              })
              .attr('stroke', function(){
                if (typeof z === 'undefined'){return'black'};
                return 'none'
              });
  });

  return canvas;

};

var x= [1,2,3,4,5];
var y= [2,3,4,6,4];
var config = {xLab: x, yLab: y, };
scatter(x,y,config);
