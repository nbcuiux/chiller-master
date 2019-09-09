$('.input-1 .input-right').focus(function (event) {
    $(event.target).parent().find('#input-left').addClass('show');
}).blur(function () {
    $(event.target).parent().find('#input-left').removeClass('show');
});