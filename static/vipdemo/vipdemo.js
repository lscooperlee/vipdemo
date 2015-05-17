var drawNumber=function () {
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
        clickX.length=0;
        clickY.length=0;
        clickDrag.length=0;
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
    })

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
    drawNumber();
}, false);