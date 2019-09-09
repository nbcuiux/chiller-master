function sticky_relocate() {
  var div_top = $('#sticky-anchor').get(0).getBoundingClientRect().top;
  if (div_top < 80) {
    //$('#sticky').hide();
    $('#ad-phantom').show();
  } else {
    //$('#sticky').show();
    $('#ad-phantom').hide();
  }
}

$(function () {
  $('#parallax').scroll(sticky_relocate);
  sticky_relocate();
});
