
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

        vec[(yp+14)*28+xp+14-j]=1;
        //vec[(yp+14)*28+xp+14+j]=1;

        vec[(yp-j+14)*28+xp+14-j]=1;
        vec[(yp-j+14)*28+xp+14+j]=1;
        vec[(yp-j+14)*28+xp+14]=1;

        //vec[(yp+14+j)*28+xp+14+j]=1;
        vec[(yp+14+j)*28+xp+14-j]=1;
        vec[(yp+14+j)*28+xp+14]=1;

      }
    };
    return vec;
};

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
      var data = JSON.parse(request.responseText);
      func(data);
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
  var request=new XMLHttpRequest();
  request.open('GET','/vipdemo/testData.json',true);

  request.onload=function(){
    console.log("dd")
    if (request.status >= 200 && request.status < 400) {
      var data = JSON.parse(request.responseText);
      for(var i=0;i<data.length;i++){
        var id="tst"+i;
        showNumber(data[i],id); 
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

    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
      
    context.fillStyle= "#f0f0f0";
                
    for(var i=0; i < 28*28; i++) {        
      if(vec[i]==1){
        sqw=Math.round(width/28);
        sqh=Math.round(height/28);

        context.fillRect(sqw*(i%28), sqh*Math.floor(i/28),sqw,sqh);
      }
    }

}

var testOnTouch(){
  var obj=document.getElementByClass("testData");
  obj.on
}

var drawNumber=function (model) {

    var paint=false;
    var clickX = new Array();
    var clickY = new Array();
    var clickDrag = new Array();

    var area=document.getElementById("canvasArea")
    var style = window.getComputedStyle(area);
    area.setAttribute('width', style.width);
    area.setAttribute('height', style.height);


    var context=area.getContext("2d");
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
    });

    area.addEventListener("mouseleave", function(e){
        paint=false;
        var vec=toVector(clickX,clickY,style.width,style.height);
        var ret=recognize(vec,model);
        var r=maxIdx(ret);
        console.log(ret)
        console.log(r)
        var d=document.getElementById("rect");
        d.innerHTML=r;
        showNumber(vec,"showArea")
        clickX.length=0;
        clickY.length=0;
        clickDrag.length=0;
    });

    function addClick(x, y, dragging){
        clickX.push(x);
        clickY.push(y);
        clickDrag.push(dragging);
    }

    function redraw(){
      context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
      
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

document.addEventListener('DOMContentLoaded', function() {
    getTestData();
    modelFunc(drawNumber);
}, false);