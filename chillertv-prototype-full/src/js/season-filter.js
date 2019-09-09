function myFunction() {
    document.getElementById("season-list").classList.toggle("season-show");
    document.getElementById("season-trigger").classList.toggle("season-show");
}

window.onclick = function(event) {
  if (!event.target.matches('.season-button')) {

    var dropitdown = document.getElementsByClassName("season-list, season-button");
    var i;
    for (i = 0; i < dropitdown.length; i++) {
      var openDropitdown = dropitdown[i];
      if (openDropitdown.classList.contains('season-show')) {
        openDropitdown.classList.remove('season-show');
      }
    }
  }
}
