function subFunction() {
    document.getElementById("mobileSub").classList.toggle("open");
    document.getElementById("sideTrigger").classList.toggle("open");
}

window.onclick = function(event) {
  if (!event.target.matches('.mobile-sub-navigation-trigger')) {

    var dropitdown = document.getElementsByClassName("mobileSub , side-navigation-trigger");
    var i;
    for (i = 0; i < dropitdown.length; i++) {
      var openDropitdown = dropitdown[i];
      if (openDropitdown.classList.contains('open')) {
        openDropitdown.classList.remove('open');
      }
    }
  }
}
