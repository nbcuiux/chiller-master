/**
 * @author Matt Hinchliffe <http://www.maketea.co.uk>
 * @modified 13/05/2011
 * @title Simple jQuery News Ticker
 */
(function($)
{
    $.fn.Ticker = function(options)
    {
        var defaults = {

            // Time to display each news item. (integer, milliseconds)
            pause: 6000,

            // Time taken to fade in next news item. (integer, milliseconds)
            fadeIn: 800,

            // Time taken to fade out current news item. (integer, milliseconds)
            fadeOut: 800,

            // Pause between displaying each item when fading between items. (integer, milliseconds)
            delay: 500,

            // Next news item typed out one character at a time. If false item will fade in. (boolean)
            typewriter: false,

            // Time to type each character if using the typewriter effect (integer, milliseconds)
            speed: 35,

            // Character to use to mimic a computer cursor if using the typewriter effect (string|boolean)
            cursor: '_'
        };

        // Merge default options with user options
        var opts = $.extend({}, defaults, options);

        return $(this).each(function()
        {
            var list = $(this), typewriter = {}, interval;

            // Activate ticker and display first item
            list
                .addClass('ticker-active')
                .children(':first')
                .css('display', 'block');

            function changeItem()
            {
                var item = list.children(':first'),
                    next = item.next(),
                    copy = item.clone();

                clearTimeout(interval);

                // Append copy of current item to bottom of list
                $(copy)
                    .css('display', 'none')
                    .appendTo(list);

                // Fade current item out, remove from DOM then animate the next item
                item.fadeOut(opts.fadeOut, function()
                {
                    $(this).remove();

                    // Animate
                    if (opts.typewriter)
                    {
                        typewriter.string = next.text();

                        next
                            .text('')
                            .css('display', 'block');

                        typewriter.count = 0;
                        typewriter.timeout = setInterval(type, opts.speed);
                    }
                    else
                    {
                        next
                            .delay(opts.delay)
                            .fadeIn(opts.fadeIn, function ()
                            {
                                setTimeout(changeItem, opts.pause);
                            });
                    }
                });
            }

            function type()
            {
                typewriter.count++;

                var text =  typewriter.string.substring(0, typewriter.count);

                if (typewriter.count >= typewriter.string.length)
                {
                    clearInterval(typewriter.timeout);
                    setTimeout(changeItem, opts.pause);
                }
                else if (opts.cursor)
                {
                    text+= ' ' + opts.cursor;
                }

                list
                    .children(':first')
                    .text(text);
            }

            // Test there are more items to display then start ticker
            if (list.find('li').length > 1 )
            {
                interval = setTimeout(changeItem, opts.pause);
            }
        });
    };

    $('.ticker').Ticker();

})(jQuery);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ0aWNrZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAYXV0aG9yIE1hdHQgSGluY2hsaWZmZSA8aHR0cDovL3d3dy5tYWtldGVhLmNvLnVrPlxuICogQG1vZGlmaWVkIDEzLzA1LzIwMTFcbiAqIEB0aXRsZSBTaW1wbGUgalF1ZXJ5IE5ld3MgVGlja2VyXG4gKi9cbihmdW5jdGlvbigkKVxue1xuICAgICQuZm4uVGlja2VyID0gZnVuY3Rpb24ob3B0aW9ucylcbiAgICB7XG4gICAgICAgIHZhciBkZWZhdWx0cyA9IHtcblxuICAgICAgICAgICAgLy8gVGltZSB0byBkaXNwbGF5IGVhY2ggbmV3cyBpdGVtLiAoaW50ZWdlciwgbWlsbGlzZWNvbmRzKVxuICAgICAgICAgICAgcGF1c2U6IDYwMDAsXG5cbiAgICAgICAgICAgIC8vIFRpbWUgdGFrZW4gdG8gZmFkZSBpbiBuZXh0IG5ld3MgaXRlbS4gKGludGVnZXIsIG1pbGxpc2Vjb25kcylcbiAgICAgICAgICAgIGZhZGVJbjogODAwLFxuXG4gICAgICAgICAgICAvLyBUaW1lIHRha2VuIHRvIGZhZGUgb3V0IGN1cnJlbnQgbmV3cyBpdGVtLiAoaW50ZWdlciwgbWlsbGlzZWNvbmRzKVxuICAgICAgICAgICAgZmFkZU91dDogODAwLFxuXG4gICAgICAgICAgICAvLyBQYXVzZSBiZXR3ZWVuIGRpc3BsYXlpbmcgZWFjaCBpdGVtIHdoZW4gZmFkaW5nIGJldHdlZW4gaXRlbXMuIChpbnRlZ2VyLCBtaWxsaXNlY29uZHMpXG4gICAgICAgICAgICBkZWxheTogNTAwLFxuXG4gICAgICAgICAgICAvLyBOZXh0IG5ld3MgaXRlbSB0eXBlZCBvdXQgb25lIGNoYXJhY3RlciBhdCBhIHRpbWUuIElmIGZhbHNlIGl0ZW0gd2lsbCBmYWRlIGluLiAoYm9vbGVhbilcbiAgICAgICAgICAgIHR5cGV3cml0ZXI6IGZhbHNlLFxuXG4gICAgICAgICAgICAvLyBUaW1lIHRvIHR5cGUgZWFjaCBjaGFyYWN0ZXIgaWYgdXNpbmcgdGhlIHR5cGV3cml0ZXIgZWZmZWN0IChpbnRlZ2VyLCBtaWxsaXNlY29uZHMpXG4gICAgICAgICAgICBzcGVlZDogMzUsXG5cbiAgICAgICAgICAgIC8vIENoYXJhY3RlciB0byB1c2UgdG8gbWltaWMgYSBjb21wdXRlciBjdXJzb3IgaWYgdXNpbmcgdGhlIHR5cGV3cml0ZXIgZWZmZWN0IChzdHJpbmd8Ym9vbGVhbilcbiAgICAgICAgICAgIGN1cnNvcjogJ18nXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gTWVyZ2UgZGVmYXVsdCBvcHRpb25zIHdpdGggdXNlciBvcHRpb25zXG4gICAgICAgIHZhciBvcHRzID0gJC5leHRlbmQoe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcblxuICAgICAgICByZXR1cm4gJCh0aGlzKS5lYWNoKGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIGxpc3QgPSAkKHRoaXMpLCB0eXBld3JpdGVyID0ge30sIGludGVydmFsO1xuXG4gICAgICAgICAgICAvLyBBY3RpdmF0ZSB0aWNrZXIgYW5kIGRpc3BsYXkgZmlyc3QgaXRlbVxuICAgICAgICAgICAgbGlzdFxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcygndGlja2VyLWFjdGl2ZScpXG4gICAgICAgICAgICAgICAgLmNoaWxkcmVuKCc6Zmlyc3QnKVxuICAgICAgICAgICAgICAgIC5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gY2hhbmdlSXRlbSgpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSBsaXN0LmNoaWxkcmVuKCc6Zmlyc3QnKSxcbiAgICAgICAgICAgICAgICAgICAgbmV4dCA9IGl0ZW0ubmV4dCgpLFxuICAgICAgICAgICAgICAgICAgICBjb3B5ID0gaXRlbS5jbG9uZSgpO1xuXG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGludGVydmFsKTtcblxuICAgICAgICAgICAgICAgIC8vIEFwcGVuZCBjb3B5IG9mIGN1cnJlbnQgaXRlbSB0byBib3R0b20gb2YgbGlzdFxuICAgICAgICAgICAgICAgICQoY29weSlcbiAgICAgICAgICAgICAgICAgICAgLmNzcygnZGlzcGxheScsICdub25lJylcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZFRvKGxpc3QpO1xuXG4gICAgICAgICAgICAgICAgLy8gRmFkZSBjdXJyZW50IGl0ZW0gb3V0LCByZW1vdmUgZnJvbSBET00gdGhlbiBhbmltYXRlIHRoZSBuZXh0IGl0ZW1cbiAgICAgICAgICAgICAgICBpdGVtLmZhZGVPdXQob3B0cy5mYWRlT3V0LCBmdW5jdGlvbigpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIEFuaW1hdGVcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdHMudHlwZXdyaXRlcilcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZXdyaXRlci5zdHJpbmcgPSBuZXh0LnRleHQoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50ZXh0KCcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZXdyaXRlci5jb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBld3JpdGVyLnRpbWVvdXQgPSBzZXRJbnRlcnZhbCh0eXBlLCBvcHRzLnNwZWVkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZGVsYXkob3B0cy5kZWxheSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmFkZUluKG9wdHMuZmFkZUluLCBmdW5jdGlvbiAoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChjaGFuZ2VJdGVtLCBvcHRzLnBhdXNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiB0eXBlKClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0eXBld3JpdGVyLmNvdW50Kys7XG5cbiAgICAgICAgICAgICAgICB2YXIgdGV4dCA9ICB0eXBld3JpdGVyLnN0cmluZy5zdWJzdHJpbmcoMCwgdHlwZXdyaXRlci5jb3VudCk7XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZXdyaXRlci5jb3VudCA+PSB0eXBld3JpdGVyLnN0cmluZy5sZW5ndGgpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHR5cGV3cml0ZXIudGltZW91dCk7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoY2hhbmdlSXRlbSwgb3B0cy5wYXVzZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKG9wdHMuY3Vyc29yKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dCs9ICcgJyArIG9wdHMuY3Vyc29yO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxpc3RcbiAgICAgICAgICAgICAgICAgICAgLmNoaWxkcmVuKCc6Zmlyc3QnKVxuICAgICAgICAgICAgICAgICAgICAudGV4dCh0ZXh0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVGVzdCB0aGVyZSBhcmUgbW9yZSBpdGVtcyB0byBkaXNwbGF5IHRoZW4gc3RhcnQgdGlja2VyXG4gICAgICAgICAgICBpZiAobGlzdC5maW5kKCdsaScpLmxlbmd0aCA+IDEgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGludGVydmFsID0gc2V0VGltZW91dChjaGFuZ2VJdGVtLCBvcHRzLnBhdXNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgICQoJy50aWNrZXInKS5UaWNrZXIoKTtcblxufSkoalF1ZXJ5KTsiXSwiZmlsZSI6InRpY2tlci5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
