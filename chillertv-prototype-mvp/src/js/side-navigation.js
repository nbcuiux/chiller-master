$(document).ready(function() {
    $(".side-navigation-trigger").click(function(event) {   
        $('body').find(".side-navigation, .side-navigation-container")
            .toggleClass("open");
    });
});

var nav = $( '.side-navigation' )[0];
var navi = $( '.side-navigation-container' )[0];
                
$( document ).on( 'keydown', function ( e ) {
    if ( e.keyCode === 27 ) {
        $( nav ).toggleClass("open");
        $( navi ).toggleClass("open");
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzaWRlLW5hdmlnYXRpb24uanMiXSwic291cmNlc0NvbnRlbnQiOlsiJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG4gICAgJChcIi5zaWRlLW5hdmlnYXRpb24tdHJpZ2dlclwiKS5jbGljayhmdW5jdGlvbihldmVudCkgeyAgIFxuICAgICAgICAkKCdib2R5JykuZmluZChcIi5zaWRlLW5hdmlnYXRpb24sIC5zaWRlLW5hdmlnYXRpb24tY29udGFpbmVyXCIpXG4gICAgICAgICAgICAudG9nZ2xlQ2xhc3MoXCJvcGVuXCIpO1xuICAgIH0pO1xufSk7XG5cbnZhciBuYXYgPSAkKCAnLnNpZGUtbmF2aWdhdGlvbicgKVswXTtcbnZhciBuYXZpID0gJCggJy5zaWRlLW5hdmlnYXRpb24tY29udGFpbmVyJyApWzBdO1xuICAgICAgICAgICAgICAgIFxuJCggZG9jdW1lbnQgKS5vbiggJ2tleWRvd24nLCBmdW5jdGlvbiAoIGUgKSB7XG4gICAgaWYgKCBlLmtleUNvZGUgPT09IDI3ICkge1xuICAgICAgICAkKCBuYXYgKS50b2dnbGVDbGFzcyhcIm9wZW5cIik7XG4gICAgICAgICQoIG5hdmkgKS50b2dnbGVDbGFzcyhcIm9wZW5cIik7XG4gICAgfVxufSk7Il0sImZpbGUiOiJzaWRlLW5hdmlnYXRpb24uanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
