function myFunction() {
    document.getElementById("date-list").classList.toggle("date-show");
    document.getElementById("date-trigger").classList.toggle("date-show");
}

window.onclick = function(event) {
  if (!event.target.matches('.date-button')) {

    var dropdowns = document.getElementsByClassName("date-list, date-button");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('date-show')) {
        openDropdown.classList.remove('date-show');
      }
    }
  }
}
