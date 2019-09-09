
if ($('.parallax').length > 0) {
  $('.parallax').scroll(function() {
    if ($('.parallax').scrollTop() > 1){
      $('.nav, .series-nav, .series-nav-about').addClass("sticky");
    }
    else{
      $('.nav, .series-nav, .series-nav-about').removeClass("sticky");
    }
  });
} else {
  $(window).scroll(function() {
  if ($(this).scrollTop() > 1){
      $('.nav').addClass("sticky");
    }
    else{
      $('.nav').removeClass("sticky");
    }
  });

  $(window).scroll(function() {
  if ($(this).scrollTop() > 1){
      $('.series-nav').addClass("sticky");
    }
    else{
      $('.series-nav').removeClass("sticky");
    }
  });

  $(window).scroll(function() {
  if ($(this).scrollTop() > 1){
      $('.series-nav-about').addClass("sticky");
    }
    else{
      $('.series-nav-about').removeClass("sticky");
    }
  });
}
