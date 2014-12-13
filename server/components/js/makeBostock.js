var makeBostock = function(nateObj){
  if (nateObj.twoD){
    if (nateObj.type === 'histogram'){
      return twoDStart() + getStart() + getHisto() + getFunCall(nateObj) + htmlClose();
    }
    if (nateObj.type === 'scatter'){
      return twoDStart() + getStart() + getScatter() + getFunCall(nateObj) + htmlClose();
    }
    else {
      return '';
    }
  }
  else{
    return threeDStart() + getThreePlot() + getFunCallThree(nateObj) + htmlClose();
  }
};


  var twoDStart = function(){
    var string = "<html>\n  <head>\n    <script src=\"http:\/\/d3js.org\/d3.v3.min.js\" charset=\"utf-8\"><\/script>\n    <style type=\"text\/css\">\n      svg path, svg line{\n        fill:none;\n        stroke:black;\n      }\n      svg text {\n        font-family: sans-serif;\n        font-size: 11px;\n      }\n    <\/style>\n  <\/head>\n  <body><\/body>\n  <script type=\"text\/javascript\">\n\n  ";
    return string;

  };
  var htmlClose = function(){
    var string = '</script></html>';
    return string;
  };

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
        string += "scatter("+callString+"config);";
        return string;
      }


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
  };

  var getStart = function(){
    var string = "var start = function(xLab,yLab,xMap,yMap,canvasWidth,canvasHeight,width,height,selector){\n\n    var canvas = d3.select(selector)\n                  .append(\'svg\')\n                  .attr(\'height\',canvasHeight)\n                  .attr(\'width\', canvasWidth);\n\n    var everything = canvas.append(\'g\');\n\n    everything.attr(\'transform\',\'translate(\'+(width * 0.2)+\',\'+height*0.1+\')\');\n\n    var xAxis = d3.svg.axis()\n                .scale(xMap);\n\n    var yAxis = d3.svg.axis()\n                .scale(yMap)\n                .orient(\'left\');\n\n    everything.append(\'g\')\n          .attr(\'transform\',\'translate(0,\'+height+\')\')\n          .call(xAxis);\n\n    everything.append(\'g\')\n          .call(yAxis);\n\n    var xLabel = everything.append(\'text\')\n                .attr(\'x\',canvasWidth*0.4)\n                .attr(\'y\',height+45)\n                .text(xLab)\n                .attr(\'text-anchor\',\'middle\');\n\n    var yLabel = everything.append(\'text\')\n                .attr(\'x\', -canvasHeight*0.4)\n                .attr(\'y\', -canvasWidth*0.1)\n                .attr(\'transform\',\'rotate(-90)\')\n                .text(yLab)\n                .attr(\'text-anchor\',\'middle\');\n\n    var objects = [canvas,everything];\n    return objects;\n\n  };\n\n\n  ";
    return string;
  };

  var getHisto = function(){
    var string = "var histo = function(data,config){\n  if (typeof config === \'undefined\'){config = {}}\n  var xLab=config.xLab,selector=config.selector,canvasWidth=config.width,canvasHeight=config.height;\n\n  if(typeof canvasWidth === \'undefined\'){\n    canvasWidth = 500;\n  }\n  if(typeof canvasHeight === \'undefined\'){\n    canvasHeight = 500;\n  }\n  if(typeof selector === \'undefined\'){\n    selector = \'body\';\n  }\n  if(typeof xLab === \'undefined\'){\n    xLab = \'\';\n  }\n\n  var hist = function(arr){\n    var newArr = arr.slice().sort(function(a,b){\n        return a-b;\n    });\n\n    var max = newArr[arr.length -1];\n    var min = newArr[0];\n    var bins = Math.round(Math.sqrt(arr.length));\n    var binSize = (max-min)\/bins;\n\n    var obj= {};\n    var keys = [];\n    for (var i=0; i<bins; i++){\n        var key = min + (i*binSize);\n        keys.push(key);\n        obj[key] = 0;\n    }\n\n    for (var j=0; j<arr.length; j++){\n        var val = min;\n        var temp_key = 0;\n        while(true){\n            if (newArr[j] == newArr[newArr.length-1]){\n                obj[keys[keys.length-1]] += 1;\n                break;\n            }\n            else if (newArr[j]<val+binSize){\n                obj[keys[temp_key]]+= 1;\n                break;\n            }\n            else{\n                temp_key += 1;\n                val += binSize;\n            }\n        }\n    }\n\n      return [obj,min,max,binSize];\n  };\n\n  var height = canvasHeight\/1.3;\n  var width = canvasWidth\/1.3;\n  if (canvasHeight - height < 75){height -= 45}\n\n  var allData = hist(data);\n\n  var xMap = d3.scale.linear()\n                  .domain([allData[1],allData[2]])\n                  .range([0,width]);\n\n  var maxfreq = Math.max.apply( null,Object.keys(allData[0]).map(function ( key ) { return allData[0][key]; }) );\n\n  var yMap = d3.scale.linear()\n                  .domain([maxfreq,0])\n                  .range([0,height]);\n\n  var objects = start(xLab,\'Frequency\',xMap,yMap,canvasWidth,canvasHeight,width,height,selector);\n\n  var canvas = objects[0];\n  var everything = objects[1];\n\n  var obj = allData[0];\n  var keys = Object.keys(obj);\n  var arr = [];\n  for (var i=0;i<keys.length;i++){\n      arr.push(obj[keys[i]]);\n  }\n\n  var binSize = xMap(allData[3] + allData[1]);\n  var padding = binSize * 0.075;\n\n  everything.selectAll(\'rect\')\n        .data(arr)\n        .enter()\n        .append(\'rect\')\n        .attr(\'x\', function(d,index){\n          return (index*binSize + padding\/2);\n        })\n        .attr(\'y\', function(d){\n          return yMap(d);\n        })\n        .attr(\'height\', function(d){\n          return Math.max(yMap(maxfreq - d) - 0.5, 0);\n        })\n        .attr(\'width\', binSize-padding)\n        .style(\'fill\', \'steelBlue\');\n\n  return canvas;\n};";

    return string;
  };


  var getScatter = function(){
    var string = "var scatter = function(x,y,config){\n  if (typeof config === \'undefined\'){config = {}};\n  var xLab=config.xLab,yLab=config.yLab,selector=config.selector,canvasWidth=config.width,canvasHeight=config.height,z=config.size,zLab=config.sizeLab;\n\n  if(typeof canvasWidth === \'undefined\'){\n    canvasWidth = 500;\n  }\n  if(typeof canvasHeight === \'undefined\'){\n    canvasHeight = 500;\n  }\n  if(typeof selector === \'undefined\'){\n    selector = \'body\';\n  }\n\n  var xSort = x.slice().sort(function(a,b){\n        return a-b;\n  });\n\n  var ySort = y.slice().sort(function(a,b){\n        return a-b;\n    });\n\n  if (typeof z !== \'undefined\'){\n    var zSort = z.slice().sort(function(a,b){\n          return a-b;\n    });\n  }\n\n  var yMax = ySort[ySort.length-1];\n  var yMin = ySort[0];\n\n  var height = canvasHeight\/1.3;\n  var width = canvasWidth\/1.3;\n  if (canvasHeight - height < 75){height -= 45}\n\n  if (typeof x[0] !== \'number\'){\n    if (typeof Date.parse(x[0]) === \'number\'){\n      var xMap = d3.time.scale()\n                      .domain([new Date(x[0]),new Date(x[x.length-1])])\n                      .range([0,width]);\n      x.forEach(function(element,index){\n        x[index] = new Date(x[index]);\n      });\n    }\n  }\n  else{\n    var xMax = xSort[xSort.length-1];\n    var xMin = xSort[0];\n\n    var xMap = d3.scale.linear()\n                    .domain([xMin,xMax])\n                    .range([0,width]);\n  }\n\n  var yMap = d3.scale.linear()\n                  .domain([yMax,yMin])\n                  .range([0,height]);\n\n  if (typeof zLab !== \'undefined\'){yLab = yLab+\' (\'+zLab+\')\'}\n  var objects = start(xLab,yLab,xMap,yMap,canvasWidth,canvasHeight,width,height,selector);\n\n  var canvas = objects[0];\n  var everything = objects[1];\n\n\n  x.forEach(function(elem,index){\n    everything.append(\'circle\')\n              .attr(\'r\',function(){\n                if (typeof z === \'undefined\'){\n                  return height*width*(0.00002);\n                }\n                else{\n                  return (height*width*0.000025 + (z[index]-zSort[0])*(height*width*(0.0001))\/(zSort[zSort.length-1] - zSort[0]));\n                }\n              })\n              .attr(\'cx\',xMap(x[index]))\n              .attr(\'cy\',yMap(y[index]))\n              .attr(\'opacity\',function(){\n                if (typeof z === \'undefined\'){\n                  return 1;\n                }\n                else{\n                  return 0.3;\n                }\n              })\n              .attr(\'fill\',function(){\n                if (typeof z === \'undefined\'){\n                  return \'none\';\n                }\n                else{\n                  return \'steelBlue\';\n                }\n              })\n              .attr(\'stroke\', function(){\n                if (typeof z === \'undefined\'){return\'black\'}\n                return \'none\';\n              });\n  });\n\n  return canvas;\n\n};";
    return string;
  };


  var getThreePlot = function(){
  var string = "THREE.OrbitControls = function ( object, domElement ) {\n\n  this.object = object;\n  this.domElement = ( domElement !== undefined ) ? domElement : document;\n\n\n  this.enabled = true;\n\n \n  this.target = new THREE.Vector3();\n \n  this.center = this.target;\n\n \n  this.noZoom = false;\n  this.zoomSpeed = 1.0;\n\n  this.minDistance = 0;\n  this.maxDistance = Infinity;\n\n\n  this.noRotate = false;\n  this.rotateSpeed = 1.0;\n\n\n  this.noPan = false;\n  this.keyPanSpeed = 7.0; \n\n  \n  this.autoRotate = false;\n  this.autoRotateSpeed = 2.0; \n  \n  this.minPolarAngle = 0; \n  this.maxPolarAngle = Math.PI; \n\n  \n  this.noKeys = false;\n\n  this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };\n\n\n  var scope = this;\n\n  var EPS = 0.000001;\n\n  var rotateStart = new THREE.Vector2();\n  var rotateEnd = new THREE.Vector2();\n  var rotateDelta = new THREE.Vector2();\n\n  var panStart = new THREE.Vector2();\n  var panEnd = new THREE.Vector2();\n  var panDelta = new THREE.Vector2();\n\n  var dollyStart = new THREE.Vector2();\n  var dollyEnd = new THREE.Vector2();\n  var dollyDelta = new THREE.Vector2();\n\n  var phiDelta = 0;\n  var thetaDelta = 0;\n  var scale = 1;\n  var pan = new THREE.Vector3();\n\n  var lastPosition = new THREE.Vector3();\n\n  var STATE = { NONE : -1, ROTATE : 0, DOLLY : 1, PAN : 2, TOUCH_ROTATE : 3, TOUCH_DOLLY : 4, TOUCH_PAN : 5 };\n  var state = STATE.NONE;\n\n\n  var changeEvent = { type: \'change\' };\n\n\n  this.rotateLeft = function ( angle ) {\n\n    if ( angle === undefined ) {\n\n      angle = getAutoRotationAngle();\n\n    }\n\n    thetaDelta -= angle;\n\n  };\n\n  this.rotateUp = function ( angle ) {\n\n    if ( angle === undefined ) {\n\n      angle = getAutoRotationAngle();\n\n    }\n\n    phiDelta -= angle;\n\n  };\n\n  \n  this.panLeft = function ( distance ) {\n\n    var panOffset = new THREE.Vector3();\n    var te = this.object.matrix.elements;\n\n    panOffset.set( te[0], te[1], te[2] );\n    panOffset.multiplyScalar(-distance);\n\n    pan.add( panOffset );\n\n  };\n\n  this.panUp = function ( distance ) {\n\n    var panOffset = new THREE.Vector3();\n    var te = this.object.matrix.elements;\n  \n    panOffset.set( te[4], te[5], te[6] );\n    panOffset.multiplyScalar(distance);\n\n    pan.add( panOffset );\n  };\n\n\n  this.pan = function ( delta ) {\n\n    var element = scope.domElement === document ? scope.domElement.body : scope.domElement;\n\n    if ( scope.object.fov !== undefined ) {\n\n\n      var position = scope.object.position;\n      var offset = position.clone().sub( scope.target );\n      var targetDistance = offset.length();\n\n      \n      targetDistance *= Math.tan( (scope.object.fov\/2) * Math.PI \/ 180.0 );\n      \n      scope.panLeft( 2 * delta.x * targetDistance \/ element.clientHeight );\n      scope.panUp( 2 * delta.y * targetDistance \/ element.clientHeight );\n\n    } else if ( scope.object.top !== undefined ) {\n\n \n      scope.panLeft( delta.x * (scope.object.right - scope.object.left) \/ element.clientWidth );\n      scope.panUp( delta.y * (scope.object.top - scope.object.bottom) \/ element.clientHeight );\n\n    } else {\n\n      \n      console.warn( \'WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.\' );\n\n    }\n\n  };\n\n  this.dollyIn = function ( dollyScale ) {\n\n    if ( dollyScale === undefined ) {\n\n      dollyScale = getZoomScale();\n\n    }\n\n    scale \/= dollyScale;\n\n  };\n\n  this.dollyOut = function ( dollyScale ) {\n\n    if ( dollyScale === undefined ) {\n\n      dollyScale = getZoomScale();\n\n    }\n\n    scale *= dollyScale;\n\n  };\n\n  this.update = function () {\n\n    var position = this.object.position;\n    var offset = position.clone().sub( this.target );\n\n\n    var theta = Math.atan2( offset.x, offset.z );\n\n   \n\n    var phi = Math.atan2( Math.sqrt( offset.x * offset.x + offset.z * offset.z ), offset.y );\n\n    if ( this.autoRotate ) {\n\n      this.rotateLeft( getAutoRotationAngle() );\n\n    }\n\n    theta += thetaDelta;\n    phi += phiDelta;\n\n  \n    phi = Math.max( this.minPolarAngle, Math.min( this.maxPolarAngle, phi ) );\n\n   \n    phi = Math.max( EPS, Math.min( Math.PI - EPS, phi ) );\n\n    var radius = offset.length() * scale;\n\n \n    radius = Math.max( this.minDistance, Math.min( this.maxDistance, radius ) );\n\n   \n    this.target.add( pan );\n\n    offset.x = radius * Math.sin( phi ) * Math.sin( theta );\n    offset.y = radius * Math.cos( phi );\n    offset.z = radius * Math.sin( phi ) * Math.cos( theta );\n\n    position.copy( this.target ).add( offset );\n\n    this.object.lookAt( this.target );\n\n    thetaDelta = 0;\n    phiDelta = 0;\n    scale = 1;\n    pan.set(0,0,0);\n\n    if ( lastPosition.distanceTo( this.object.position ) > 0 ) {\n\n      this.dispatchEvent( changeEvent );\n\n      lastPosition.copy( this.object.position );\n\n    }\n\n  };\n\n\n  function getAutoRotationAngle() {\n\n    return 2 * Math.PI \/ 60 \/ 60 * scope.autoRotateSpeed;\n\n  }\n\n  function getZoomScale() {\n\n    return Math.pow( 0.95, scope.zoomSpeed );\n\n  }\n\n  function onMouseDown( event ) {\n\n    if ( scope.enabled === false ) { return; }\n    event.preventDefault();\n\n    if ( event.button === 0 ) {\n      if ( scope.noRotate === true ) { return; }\n\n      state = STATE.ROTATE;\n\n      rotateStart.set( event.clientX, event.clientY );\n\n    } else if ( event.button === 1 ) {\n      if ( scope.noZoom === true ) { return; }\n\n      state = STATE.DOLLY;\n\n      dollyStart.set( event.clientX, event.clientY );\n\n    } else if ( event.button === 2 ) {\n      if ( scope.noPan === true ) { return; }\n\n      state = STATE.PAN;\n\n      panStart.set( event.clientX, event.clientY );\n\n    }\n\n\n    scope.domElement.addEventListener( \'mousemove\', onMouseMove, false );\n    scope.domElement.addEventListener( \'mouseup\', onMouseUp, false );\n\n  }\n\n  function onMouseMove( event ) {\n\n    if ( scope.enabled === false ) return;\n\n    event.preventDefault();\n\n    var element = scope.domElement === document ? scope.domElement.body : scope.domElement;\n\n    if ( state === STATE.ROTATE ) {\n\n      if ( scope.noRotate === true ) return;\n\n      rotateEnd.set( event.clientX, event.clientY );\n      rotateDelta.subVectors( rotateEnd, rotateStart );\n\n      scope.rotateLeft( 2 * Math.PI * rotateDelta.x \/ element.clientWidth * scope.rotateSpeed );\n   \n      scope.rotateUp( 2 * Math.PI * rotateDelta.y \/ element.clientHeight * scope.rotateSpeed );\n\n      rotateStart.copy( rotateEnd );\n\n    } else if ( state === STATE.DOLLY ) {\n\n      if ( scope.noZoom === true ) return;\n\n      dollyEnd.set( event.clientX, event.clientY );\n      dollyDelta.subVectors( dollyEnd, dollyStart );\n\n      if ( dollyDelta.y > 0 ) {\n\n        scope.dollyIn();\n\n      } else {\n\n        scope.dollyOut();\n\n      }\n\n      dollyStart.copy( dollyEnd );\n\n    } else if ( state === STATE.PAN ) {\n\n      if ( scope.noPan === true ) return;\n\n      panEnd.set( event.clientX, event.clientY );\n      panDelta.subVectors( panEnd, panStart );\n\n      scope.pan( panDelta );\n\n      panStart.copy( panEnd );\n\n    }\n\n  \n    scope.update();\n\n  }\n\n  function onMouseUp( \/* event *\/ ) {\n\n    if ( scope.enabled === false ) return;\n\n\n    scope.domElement.removeEventListener( \'mousemove\', onMouseMove, false );\n    scope.domElement.removeEventListener( \'mouseup\', onMouseUp, false );\n\n    state = STATE.NONE;\n\n  }\n\n  function onMouseWheel( event ) {\n\n    if ( scope.enabled === false || scope.noZoom === true ) return;\n\n    var delta = 0;\n\n    if ( event.wheelDelta ) { \n\n      delta = event.wheelDelta;\n\n    } else if ( event.detail ) { \n      delta = - event.detail;\n\n    }\n\n    if ( delta > 0 ) {\n\n      scope.dollyOut();\n\n    } else {\n\n      scope.dollyIn();\n\n    }\n\n  }\n\n  function onKeyDown( event ) {\n\n    if ( scope.enabled === false ) { return; }\n    if ( scope.noKeys === true ) { return; }\n    if ( scope.noPan === true ) { return; }\n\n    var needUpdate = false;\n\n    switch ( event.keyCode ) {\n\n      case scope.keys.UP:\n        scope.pan( new THREE.Vector2( 0, scope.keyPanSpeed ) );\n        needUpdate = true;\n        break;\n      case scope.keys.BOTTOM:\n        scope.pan( new THREE.Vector2( 0, -scope.keyPanSpeed ) );\n        needUpdate = true;\n        break;\n      case scope.keys.LEFT:\n        scope.pan( new THREE.Vector2( scope.keyPanSpeed, 0 ) );\n        needUpdate = true;\n        break;\n      case scope.keys.RIGHT:\n        scope.pan( new THREE.Vector2( -scope.keyPanSpeed, 0 ) );\n        needUpdate = true;\n        break;\n    }\n\n    if ( needUpdate ) {\n\n      scope.update();\n\n    }\n\n  }\n\n  function touchstart( event ) {\n\n    if ( scope.enabled === false ) { return; }\n\n    switch ( event.touches.length ) {\n\n      case 1:\n        if ( scope.noRotate === true ) { return; }\n\n        state = STATE.TOUCH_ROTATE;\n\n        rotateStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );\n        break;\n\n      case 2: \n        if ( scope.noZoom === true ) { return; }\n\n        state = STATE.TOUCH_DOLLY;\n\n        var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;\n        var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;\n        var distance = Math.sqrt( dx * dx + dy * dy );\n        dollyStart.set( 0, distance );\n        break;\n\n      case 3: \n        if ( scope.noPan === true ) { return; }\n\n        state = STATE.TOUCH_PAN;\n\n        panStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );\n        break;\n\n      default:\n        state = STATE.NONE;\n\n    }\n  }\n\n  function touchmove( event ) {\n\n    if ( scope.enabled === false ) { return; }\n\n    event.preventDefault();\n    event.stopPropagation();\n\n    var element = scope.domElement === document ? scope.domElement.body : scope.domElement;\n\n    switch ( event.touches.length ) {\n\n      case 1: \n        if ( scope.noRotate === true ) { return; }\n        if ( state !== STATE.TOUCH_ROTATE ) { return; }\n\n        rotateEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );\n        rotateDelta.subVectors( rotateEnd, rotateStart );\n\n        \n        scope.rotateLeft( 2 * Math.PI * rotateDelta.x \/ element.clientWidth * scope.rotateSpeed );\n        \n        scope.rotateUp( 2 * Math.PI * rotateDelta.y \/ element.clientHeight * scope.rotateSpeed );\n\n        rotateStart.copy( rotateEnd );\n        break;\n\n      case 2: \n        if ( scope.noZoom === true ) { return; }\n        if ( state !== STATE.TOUCH_DOLLY ) { return; }\n\n        var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;\n        var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;\n        var distance = Math.sqrt( dx * dx + dy * dy );\n\n        dollyEnd.set( 0, distance );\n        dollyDelta.subVectors( dollyEnd, dollyStart );\n\n        if ( dollyDelta.y > 0 ) {\n\n          scope.dollyOut();\n\n        } else {\n\n          scope.dollyIn();\n\n        }\n\n        dollyStart.copy( dollyEnd );\n        break;\n\n      case 3: \n        if ( scope.noPan === true ) { return; }\n        if ( state !== STATE.TOUCH_PAN ) { return; }\n\n        panEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );\n        panDelta.subVectors( panEnd, panStart );\n\n        scope.pan( panDelta );\n\n        panStart.copy( panEnd );\n        break;\n\n      default:\n        state = STATE.NONE;\n\n    }\n\n  }\n\n  function touchend( \/* event *\/ ) {\n\n    if ( scope.enabled === false ) { return; }\n\n    state = STATE.NONE;\n  }\n\n  this.domElement.addEventListener( \'contextmenu\', function ( event ) { event.preventDefault(); }, false );\n  this.domElement.addEventListener( \'mousedown\', onMouseDown, false );\n  this.domElement.addEventListener( \'mousewheel\', onMouseWheel, false );\n  this.domElement.addEventListener( \'DOMMouseScroll\', onMouseWheel, false ); \n  this.domElement.addEventListener( \'keydown\', onKeyDown, false );\n\n  this.domElement.addEventListener( \'touchstart\', touchstart, false );\n  this.domElement.addEventListener( \'touchend\', touchend, false );\n  this.domElement.addEventListener( \'touchmove\', touchmove, false );\n\n};\n\nTHREE.OrbitControls.prototype = Object.create( THREE.EventDispatcher.prototype );\n\nvar plot3d = function(arrX, arrY,arrZ,config) {\n\n  if (typeof config === \'undefined\') config = {};\n\n  var arrSort = function(arr){\n    var newArr = arr.slice().sort(function(a,b){\n      return a-b;\n    });\n    return newArr;\n  };\n\n  var xMax = arrSort(arrX)[arrX.length - 1];\n  var xMin = arrSort(arrX)[0];\n  var yMax = arrSort(arrY)[arrY.length - 1];\n  var yMin = arrSort(arrY)[0];\n  var zMax = arrSort(arrZ)[arrZ.length - 1];\n  var zMin = arrSort(arrZ)[0];\n\n  if (typeof config.size !== \'undefined\'){\n    var sizeMax = arrSort(config.size)[arrX.length - 1];\n    var sizeMin = arrSort(config.size)[0];\n  }\n\n  var scene = new THREE.Scene();\n\n  var light = new THREE.AmbientLight( 0x333333 );\n  scene.add( light );\n\n  var spotLight = new THREE.SpotLight( 0xffffff );\n  spotLight.position.set( 100, 1000, 100 );\n  spotLight.castShadow = true;\n  spotLight.shadowMapWidth = 1024;\n  spotLight.shadowMapHeight = 1024;\n  spotLight.shadowCameraNear = 500;\n  spotLight.shadowCameraFar = 4000;\n  spotLight.shadowCameraFov = 30;\n  scene.add( spotLight );\n\n  var camera = new THREE.PerspectiveCamera( 50, window.innerWidth \/ window.innerHeight, 0.1, 1000 );\n  camera.position.x = 1.75 * Math.max(xMax, -xMin);\n  camera.position.y = 1.75 * Math.max(yMax, -yMin);\n  camera.position.z = 1.75 * Math.max(zMax, -zMin);\n\n  var renderer = new THREE.WebGLRenderer();\n  renderer.setClearColor(0xffffff);\n  renderer.setSize( window.innerWidth, window.innerHeight );\n\n\n  if (typeof config.elementID === \'undefined\'){\n    document.body.appendChild(renderer.domElement);\n  }\n  else{\n    document.getElementById(config.elementID).appendChild(renderer.domElement);\n  }\n\n  renderer.domElement.style.width = (typeof config.width === \'undefined\') ? \'500px\' : String(config.width)+\'px\';\n  renderer.domElement.style.height = (typeof config.height === \'undefined\') ? \'500px\' : String(config.height)+\'px\';\n\n\n  controls = new THREE.OrbitControls( camera, renderer.domElement );\n  controls.addEventListener( \'change\', render );\n\n  function animate(){\n    requestAnimationFrame(animate);\n    render();\n    controls.update();\n  }\n  animate();\n\n\n  function getColorObj(color){\n    if (typeof color === \'undefined\'){\n      var colorObj = (typeof config.size === \'undefined\') ? {color:0x000000} : {color:0x999999};\n    }\n    else{\n      var colorObj = { color: parseInt(\'0x\'+color) };\n    }\n    return colorObj;\n  }\n\n  function point(a,b,c,size,color){\n    var geometry = new THREE.SphereGeometry(size,15,15);\n    var material = new THREE.MeshLambertMaterial(getColorObj(color));\n    var sphere = new THREE.Mesh(geometry, material);\n    sphere.overdraw = true;\n    sphere.position.x = a;\n    sphere.position.y = b;\n    sphere.position.z = c;\n    return sphere;\n  }\n\n\n  var baseSize = Math.pow((xMax - xMin) * (yMax - yMin) * (zMax - zMin),1\/3)\/100;\n  for (var i=0; i<arrX.length;i++){\n    if (typeof config.size !== \'undefined\'){\n      var size = baseSize + baseSize*8*((config.size[i] - sizeMin)\/(sizeMax - sizeMin));\n    }\n    else{\n      var size = baseSize;\n    }\n    if (typeof config.color !== \'undefined\'){\n      var color = config.color[i];\n    }\n    else{\n      var color = undefined;\n    }\n    scene.add(point(arrX[i],arrY[i],arrZ[i],size,color));\n  }\n\n\n  var matPos = new THREE.LineBasicMaterial({\n    color: 0x000000\n  });\n\n   var matNeg = new THREE.LineBasicMaterial({\n    color: 0x999999\n  });\n\n  var liner = function(x,y,z,material){\n    var geometry = new THREE.Geometry();\n    geometry.vertices.push(new THREE.Vector3(0, 0, 0));\n    geometry.vertices.push(new THREE.Vector3(x, y, z));\n\n    var line = new THREE.Line(geometry, material);\n    return line;\n  };\n\n  if(xMax > 0) scene.add(liner(xMax,0,0,matPos));\n  if(yMax > 0) scene.add(liner(0,yMax,0,matPos));\n  if(zMax > 0) scene.add(liner(0,0,zMax,matPos));\n\n  if(xMin < 0) scene.add(liner(xMin,0,0,matNeg));\n  if(yMin < 0) scene.add(liner(0,yMin,0,matNeg));\n  if(zMin < 0) scene.add(liner(0,0,zMin,matNeg));\n\n\n  function axisLabel(text,posObj){\n    var params = {\n      font:\'helvetiker\',\n      height:baseSize,\n      size:baseSize*3,\n      weight:\'normal\',\n      style:\'normal\',\n    };\n    var labelGeo = new THREE.TextGeometry(text,params);\n    setTimeout(function(){\n      word.position.x = (posObj.x < 0) ? posObj.x - labelGeo.boundingSphere.radius*2: posObj.x;\n      word.position.y = (posObj.y < 0) ? posObj.y - labelGeo.boundingSphere.radius\/3: posObj.y;\n      word.position.z = posObj.z;\n    },100);\n    var wrap = new THREE.MeshLambertMaterial({color:0x000000});\n    var word = new THREE.Mesh(labelGeo,wrap);\n    scene.add(word);\n  }\n\n  function rounder(num){\n    return Math.round(num*100)\/100;\n  }\n  var xLab = (typeof config.xLab === \'undefined\') ? \'X = \'+rounder(xMax) : config.xLab+\' = \'+rounder(xMax);\n  var yLab = (typeof config.yLab === \'undefined\') ? \'Y = \'+rounder(yMax) : config.yLab+\' = \'+rounder(yMax);\n  var zLab = (typeof config.zLab === \'undefined\') ? \'Z = \'+rounder(zMax) : config.zLab+\' = \'+rounder(zMax);\n\n  var xLabMin = (typeof config.xLab === \'undefined\') ? \'X = \'+rounder(xMin) : config.xLab+\' = \'+rounder(xMin);\n  var yLabMin = (typeof config.yLab === \'undefined\') ? \'Y = \'+rounder(yMin) : config.yLab+\' = \'+rounder(yMin);\n  var zLabMin = (typeof config.zLab === \'undefined\') ? \'Z = \'+rounder(zMin) : config.zLab+\' = \'+rounder(zMin);\n\n  if(xMax > 0) axisLabel(xLab, {x:xMax,y:0,z:0});\n  if(yMax > 0) axisLabel(yLab, {x:0,y:yMax,z:0});\n  if(zMax > 0) axisLabel(zLab, {x:0,y:0,z:zMax});\n  if(xMin < 0) axisLabel(xLabMin, {x:xMin,y:0,z:0});\n  if(yMin < 0) axisLabel(yLabMin, {x:0,y:yMin,z:0});\n  if(zMin < 0) axisLabel(zLabMin, {x:0,y:0,z:zMin});\n\n  function render(){\n    renderer.render(scene,camera);\n  }\n  render();\n\n  return renderer.domElement;\n};\n\n\n";
  return string;
};


var getFunCallThree = function(nateObj){
    var labels = ['xLab','yLab','zLab','sizeLab'];
    var string = '';

    delete nateObj.pointLabels;
    delete nateObj.type;
    delete nateObj.twoD;

    var sizeString = '';
    if (typeof nateObj.size !== 'undefined'){
      sizeString = 'size: ['+nateObj.size+'], ';
      delete nateObj.size;
    }
    var colorString = '';
    if (typeof nateObj.color !== 'undefined'){
      colorString = 'color: ['+nateObj.color+']';
      colorString = colorString.replace(/,/g,'","').replace('[','["').replace(']','"]');
      delete nateObj.color;
    }

    var keys = Object.keys(nateObj);
    var labelString = "";
    var callString = "";
    keys.forEach(function(key,i){
        string += 'var '+key+'= ['+nateObj[key]+"]; \n";
        labelString += labels[i] +": "+"'"+key+"'" +", ";
        if (i < 3) callString += key+',';
    });
    string += "var config = {" + labelString + sizeString + colorString+"};\n";
    string += "plot3d("+callString+"config);";
    return string;
};

var threeDStart = function(){
 var string = "<html>\n  <head>\n    <script src=\"http:\/\/threejs.org\/build\/three.min.js\"><\/script>\n  <\/head>\n  <body><\/body>\n  <script type=\"text\/javascript\">";
  return string;
};


var testObj = {
  type: 'scatter',
  twoD: false,
  pointLabels:[],
  aa: [1,2,3,4,5,12,43,32,22],
  bb: [1,2,3,4,5,12,43,32,22],
  cc: [1,2,3,4,5,12,43,32,22],
  size: [1,2,3,4,5,12,43,32,22],
  color:['abc000','abc000','abc000','abc000','abc000','abc000','abc000','abc000','abc000']
};


module.exports = {
  bostock: makeBostock
}
