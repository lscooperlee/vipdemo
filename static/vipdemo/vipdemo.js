(function() {
  var vecForRec;
  var modelForRec;
  var retForRec;

  var clickX = new Array();
  var clickY = new Array();
  var clickDrag = new Array();
  var canvasWidth;
  var canvasHeight;

  function toVector(clickX, clickY, width,height) {
      var vec=new Array(28*28);
      for(var m=0;m<vec.length;m++){
        vec[m]=0;
      }

      var fixw=parseInt(width);
      var fixh=parseInt(height);
      var minx=minArray(clickX);
      var miny=minArray(clickY);
      var tw=maxArray(clickX)-minx;
      var th=maxArray(clickY)-miny;

      var w=th>tw?th:tw;
      var h=th>tw?th:tw;


      for (var i = 0; i < clickX.length; i++) {
        var xratio=(parseInt(clickX[i])-(minx+tw/2))/w;
        var yratio=(parseInt(clickY[i])-(miny+th/2))/h;

        var xp=Math.round(18*xratio);
        var yp=Math.round(18*yratio);

        var explen=2;
        for(var j=0;j<explen;j++){

          vec[(yp+14)*28+xp+14]=1;

          //vec[(yp+14)*28+xp+14-j]=1;
          vec[(yp+14)*28+xp+14+j]=1;

          //vec[(yp-j+14)*28+xp+14-j]=1;
          vec[(yp-j+14)*28+xp+14+j]=1;
          //vec[(yp-j+14)*28+xp+14]=1;

          vec[(yp+14+j)*28+xp+14+j]=1;
          vec[(yp+14+j)*28+xp+14-j]=1;
          vec[(yp+14+j)*28+xp+14]=1;

        }
      };
      return vec;
  };

  function installRecEvent () {
    function showRecResult() {
      retForRec=recognize(vecForRec,modelForRec);
      var r=maxIdx(retForRec);
      var d=document.getElementById("result");
      d.innerHTML=r;

      svgInfo();

      clickX.length=0;
      clickY.length=0;
      clickDrag.length=0;

      var area=document.getElementById("canvasArea")
      var context=area.getContext("2d");
      context.clearRect(0,0,canvasHeight,canvasWidth);
    }

    var area=document.getElementById("result");

    area.addEventListener("click",showRecResult);
  }

  function recognize(vec, model){

    var length=model.length;
    for(var i=0;i<length-1;i++){
      var weights=model[i].weights;
      var hid=model[i].bias_hidden[0];

      var ret=new Array(hid.length);
      for(var m=0;m<hid.length;m++){
        ret[m]=0;
      }

      for(var j=0;j<vec.length;j++){
        for(var k=0;k<hid.length;k++){
          ret[k]+=weights[j][k]*vec[j];
        }
      }

      for(var k=0;k<hid.length;k++){
        ret[k]=sigmond(ret[k]+hid[k]);
      }
      vec=ret;

    }

    var weights=model[length-1].weights;
    var bis=model[length-1].bias[0];
    var ret=new Array(bis.length);
    for(var m=0;m<bis.length;m++){
      ret[m]=0;
    }

    for(var j=0;j<vec.length;j++){
      for(var k=0;k<bis.length;k++){
        ret[k]+=weights[j][k]*vec[j];
      }
    }
    for(var k=0;k<bis.length;k++){
      ret[k]=ret[k]+bis[k];
    }
    return ret;
  };

  function sigmond(v){
    return 1.0/(1.0+Math.exp(-v));
  }

  var maxArray=function(arr) {
    var v=0;
    for (var i=0; i<arr.length; i++) {
      if(arr[i]>v){
        v=arr[i];
      }
    };
    return v;
  }

  var minArray=function(arr) {
    var v=65535;
    for (var i=0; i<arr.length; i++) {
      if(arr[i]<v){
        v=arr[i];
      }
    };
    return v;
  }

  var maxIdx=function(vec){
    var v=-65534;
    var idx=0;
    for (var i=0; i<vec.length; i++) {
      if(vec[i]>v){
        v=vec[i];
        idx=i;
      }
    };
    return idx;
  }



  var modelFunc=function(func) {
    var request=new XMLHttpRequest();
    request.open('GET','/static/vipdemo/mnist.json',true);
    request.onload=function(){
      if (request.status >= 200 && request.status < 400) {
        modelForRec = JSON.parse(request.responseText);
        func();
      }else{
        console.log("file error");
      }
    };

    request.onerror=function(){
      console.log("server error");
    };

    request.send();
  };


  var getTestData=function(){

    function installEvent(vec,id) {
      var area=document.getElementById(id)
      area.addEventListener("click", function(d) {
        showNumber(vec,"showArea");
        vecForRec=vec;
      });  
    }

    var request=new XMLHttpRequest();
    request.open('GET','/vipdemo/testData.json',true);

    request.onload=function(){
      console.log("dd")
      if (request.status >= 200 && request.status < 400) {
        var data = JSON.parse(request.responseText);
        for(var i=0;i<data.length;i++){
          var id="tst"+i;
          showNumber(data[i],id); 
          installEvent(data[i],id);
        }
      }else{
        console.log("file error");
      }
    };

    request.onerror=function(){
      console.log("server error");
    };

    request.send();

  };

  var showNumber=function(vec, id){
      var area=document.getElementById(id)
      var style = window.getComputedStyle(area);
      area.setAttribute('width', style.width);
      area.setAttribute('height', style.height);
      var context=area.getContext("2d");

      var width=context.canvas.width;
      var height=context.canvas.height;

      context.clearRect(0, 0, width, height); // Clears the canvas
        
      context.fillStyle= "#f0f0f0";
                  
      for(var i=0; i < 28*28; i++) {        
        if(vec[i]==1){
          sqw=Math.round(width/28);
          sqh=Math.round(height/28);

          context.fillRect(sqw*(i%28), sqh*Math.floor(i/28),sqw,sqh);
        }
      }

  }

  var drawNumber=function () {

      var paint=false;

      var area=document.getElementById("canvasArea")
      var style = window.getComputedStyle(area);
      area.setAttribute('width', style.width);
      area.setAttribute('height', style.height);


      var context=area.getContext("2d");

      canvasHeight=context.canvas.height;
      canvasWidth=context.canvas.width;

      area.addEventListener("mousedown",function(e) {
          paint = true;
          addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
          redraw();
      });

      area.addEventListener("mousemove", function(e) {
          if(paint){
              addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
              redraw();
          }
      });

      area.addEventListener("mouseup",function(e) {
          paint=false;
          vecForRec=toVector(clickX,clickY,canvasWidth,canvasHeight);
      });

      area.addEventListener("mouseleave", function(e){
          paint=false;
          if(clickX.length==0)
            return;
          vecForRec=toVector(clickX,clickY,canvasWidth,canvasHeight);
          showNumber(vecForRec,"showArea")
      });

      function addClick(x, y, dragging){
          clickX.push(x);
          clickY.push(y);
          clickDrag.push(dragging);
      }

      function redraw(){
        context.clearRect(0, 0, canvasWidth, canvasHeight); // Clears the canvas
        
        context.strokeStyle = "#df4b26";
        context.lineJoin = "round";
        context.lineWidth = 5;
                  
        for(var i=0; i < clickX.length; i++) {        
          context.beginPath();

          if(clickDrag[i] && i){
            context.moveTo(clickX[i-1], clickY[i-1]);
           }else{
             context.moveTo(clickX[i], clickY[i]);
           }

           context.lineTo(clickX[i], clickY[i]);
           context.closePath();
           context.stroke();
    }
  }

  };

  function svgInit(){
    var svg=d3.select("#bar");
    svg.selectAll("rect").data(d3.range(10)).enter().append("rect");
    svg.selectAll("text").data(d3.range(10)).enter().append("text");
  }

  function modalTips () {
    /*
    var b=document.getElementById("body");
    b.classList.add("modalBody");
    */
  }

  function svgInfo () {

    var style=window.getComputedStyle(document.getElementById("bar"))

    var width=parseInt(style.width);
    var height=parseInt(style.height);
    var toppad=Math.round(0.1*height);

    var xScale=d3.scale.ordinal().domain(d3.range(retForRec.length)).rangeRoundBands([0,width],0.1);
    var yScale=d3.scale.linear().domain([d3.min(retForRec),d3.max(retForRec)]).range([toppad,height-toppad]);

    var svg=d3.select("#bar");
    var bars=svg.selectAll("rect").data(retForRec);

    bars.transition().duration(500).delay(function(d,i){return i*1000/retForRec.length;}).attr({
      "x": function(d,i){return xScale(i);},
      "y": function(d){return height-yScale(d);},
      "width": xScale.rangeBand(),
      "height": function(d){ return yScale(d);},
      "fill": function(d){return "rgb(0,0,"+ Math.round(yScale(d)*255/(height-toppad)) +")";},
    });

    var txts=svg.selectAll("text").data(retForRec).text(function(d,i){return i;});
    txts.attr({
      "x": function(d,i){return xScale(i)+xScale.rangeBand()/2;},
      "y": function(d){return height;},
      "fill": "white",
      "text-anchor": "middle",
    });

  }

  document.addEventListener('DOMContentLoaded', function() {
      svgInit() ;
      getTestData();
      modelFunc(drawNumber);
      installRecEvent();
      modalTips();
  }, false);
}());