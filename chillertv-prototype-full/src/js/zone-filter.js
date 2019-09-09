function zoneFunction() {
    document.getElementById("zone-list").classList.toggle("zone-show");
    document.getElementById("zone-trigger").classList.toggle("zone-show");
}

window.onclick = function(event) {
  if (!event.target.matches('.zone-button')) {

    var dropitdown = document.getElementsByClassName("zone-list, zone-button");
    var i;
    for (i = 0; i < dropitdown.length; i++) {
      var openDropitdown = dropitdown[i];
      if (openDropitdown.classList.contains('zone-show')) {
        openDropitdown.classList.remove('zone-show');
      }
    }
  }
}
