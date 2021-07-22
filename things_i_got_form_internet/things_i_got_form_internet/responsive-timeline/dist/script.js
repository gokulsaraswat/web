var viewMoreButtons = document.querySelectorAll('.more');

var toggleVisibile = function(el) {
  if (el.style.fontSize === '0px' || el.style.fontSize === '')
    el.style.fontSize = '1rem';
  else
    el.style.fontSize = '0px';
};

var toggleText = function(el) {
  if (el.innerHTML === 'View Details')
    el.innerHTML = 'View Less';
  else 
    el.innerHTML = 'View Details';
};

var viewMoreButtonClickHandler = function(currBtn) {
  var details = currBtn.previousSibling;
  while(details.nodeType !== 1) details = details.previousSibling;
  toggleVisibile(details);
  toggleText(currBtn);
};

var moveDown = function(btnToMove) {
  
};

var addEventListenerPlus = function(i) {
  viewMoreButtons.item(i).addEventListener('click', 
    function(e) {
      var nextI;
      viewMoreButtonClickHandler(this);
      if (i%2 !== 0 && (i + 2) < viewMoreButtons.length) {
        moveDown(viewMoreButtons.item(i+2));
      }
    }, false);
};

for(var i=0; i < viewMoreButtons.length; i++) {
  addEventListenerPlus(i);
}