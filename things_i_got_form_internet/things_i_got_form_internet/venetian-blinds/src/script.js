var options = {
  imgSrc1:"//s3-us-west-2.amazonaws.com/s.cdpn.io/261873/TelephoneBanana.jpg",
  imgSrc2:"//s3-us-west-2.amazonaws.com/s.cdpn.io/261873/TelephoneBananaInverted.jpg",
  containerName : "placeholder",
  columns:16,
  margin:3
}


function VenetianBlinds(defaults)
{
  var cols = defaults.columns;
  var margin = defaults.margin;
  var img1 = defaults.imgSrc1;
  var img2 = defaults.imgSrc2;
  var placeholder = document.getElementsByClassName(defaults.containerName)[0];
  var directionX, directionY;
  
  var column, blind, blindImg;
  var bgImg, rot;
  var colL;
  var colW = (placeholder.offsetWidth / cols) - margin;
  for (var i=0; i < cols; i++)
    {
      colL = ((colW + margin) * i);
      
      column = document.createElement('div');
      column.className = "column";
      column.style.width = colW + "px";
      column.style.left = colL + "px";
      placeholder.appendChild(column); 
      
      for (var j=0; j<4; j++)
        {
          blind = document.createElement('div');
          blind.className = "blind";
          blind.style.width = colW + "px";
          blindImg = document.createElement('div');
          blindImg.className = "blindImg";
          
          switch (j){
             case 0:
                TweenMax.set(blind, {rotationY: "0"});
                bgImg = img1;
                break;
            case 1:
                TweenMax.set(blind, {rotationY: "90"});
                bgImg = img2;
                break;
             case 2: 
                  TweenMax.set(blind, {rotationY: "180"});
                  bgImg = img1;
                  break;              
              case 3:
                  TweenMax.set(blind, {rotationY: "270"});
                  bgImg = img2;
                  break;
          }
          blindImg.style.width = placeholder.offsetWidth + "px";
          blindImg.style.backgroundImage = "url("+bgImg+")";
          blindImg.style.left = -colL + "px";

          column.appendChild(blind);
          blind.appendChild(blindImg);
          
          TweenMax.set(blind, { transformOrigin:"50% 50% " + -colW/2, transformStyle: "preserve-3d"});
        }
      
      TweenMax.set(column, {transformStyle:"preserve-3d", transformPerspective:1000, rotationY:0});
      
       column.addEventListener("mouseenter", function(event){
            var elem = event.currentTarget;
            var rotY = elem._gsTransform.rotationY;
         
            if(directionX > 0){
              TweenMax.to(elem, 1, {rotationY:Math.floor(rotY/90)*90+90, transformOrigin:"50% 50% -" + colW/2, ease:Back.easeOut});
            }else{
              TweenMax.to(elem, 1, {rotationY:Math.floor(rotY/90)*90-90, transformOrigin:"50% 50% -" + colW/2, ease:Back.easeOut});
            }
      })
    }
      document.addEventListener('mousemove', function (event) {
      directionX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
      directionY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
    });
}

VenetianBlinds(options);

