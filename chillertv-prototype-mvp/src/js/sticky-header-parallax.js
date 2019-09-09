function sticky_relocate() {
      var window_top = $('#parallax').scrollTop();
      var div_top = $('#sticky-schedule-anchor').offset().top;
      if (window_top > div_top) {
        $('#sticky-schedule').addClass('stick');
        $('#sticky-schedule-phantom').show();
      } else {
        $('#sticky-schedule').removeClass('stick');
        $('#sticky-schedule-phantom').hide();
      }
    }

    $(function () {
      $('#parallax').scroll(sticky_relocate);
      sticky_relocate();
    });
