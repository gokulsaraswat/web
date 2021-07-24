document.getElementById("hamburger").addEventListener("click", function(){
  this.classList.toggle("active");
  document.querySelector(".mobile-menu").classList.toggle("active");
});