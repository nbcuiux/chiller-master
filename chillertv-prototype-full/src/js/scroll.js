/**
 * jquery.slitslider.js v1.1.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2012, Codrops
 * http://www.codrops.com
 */

;( function( $, window, undefined ) {

    'use strict';

    /*
    * debouncedresize: special jQuery event that happens once after a window resize
    *
    * latest version and complete README available on Github:
    * https://github.com/louisremi/jquery-smartresize/blob/master/jquery.debouncedresize.js
    *
    * Copyright 2011 @louis_remi
    * Licensed under the MIT license.
    */
    var $event = $.event,
    $special,
    resizeTimeout;

    $special = $event.special.debouncedresize = {
        setup: function() {
            $( this ).on( "resize", $special.handler );
        },
        teardown: function() {
            $( this ).off( "resize", $special.handler );
        },
        handler: function( event, execAsap ) {
            // Save the context
            var context = this,
                args = arguments,
                dispatch = function() {
                    // set correct event type
                    event.type = "debouncedresize";
                    $event.dispatch.apply( context, args );
                };

            if ( resizeTimeout ) {
                clearTimeout( resizeTimeout );
            }

            execAsap ?
                dispatch() :
                resizeTimeout = setTimeout( dispatch, $special.threshold );
        },
        threshold: 20
    };

    // global
    var $window = $( window ),
        $document = $( document ),
        Modernizr = window.Modernizr;

    $.Slitslider = function( options, element ) {

        this.$elWrapper = $( element );
        this._init( options );

    };

    $.Slitslider.defaults = {
        // transitions speed
        speed : 500,
        // if true the item's slices will also animate the opacity value
        optOpacity : true,
        // amount (%) to translate both slices - adjust as necessary
        translateFactor : 100,
        // maximum possible angle
        maxAngle : 25,
        // maximum possible scale
        maxScale : 2,
        // slideshow on / off
        autoplay : true,
        // keyboard navigation
        keyboard : true,
        // time between transitions
        interval : 6000,
        // callbacks
        onBeforeChange : function( slide, idx ) { return false; },
        onAfterChange : function( slide, idx ) { return false; }
    };

    $.Slitslider.prototype = {

        _init : function( options ) {

            // options
            this.options = $.extend( true, {}, $.Slitslider.defaults, options );

            // https://github.com/twitter/bootstrap/issues/2870
            this.transEndEventNames = {
                'WebkitTransition' : 'webkitTransitionEnd',
                'MozTransition' : 'transitionend',
                'OTransition' : 'oTransitionEnd',
                'msTransition' : 'MSTransitionEnd',
                'transition' : 'transitionend'
            };
            this.transEndEventName = this.transEndEventNames[ Modernizr.prefixed( 'transition' ) ];
            // suport for css 3d transforms and css transitions
            this.support = Modernizr.csstransitions && Modernizr.csstransforms3d;
            // the slider
            this.$el = this.$elWrapper.children( '.sl-slider' );
            // the slides
            this.$slides = this.$el.children( '.sl-slide' ).hide();
            // total slides
            this.slidesCount = this.$slides.length;
            // current slide
            this.current = 0;
            // control if it's animating
            this.isAnimating = false;
            // get container size
            this._getSize();
            // layout
            this._layout();
            // load some events
            this._loadEvents();
            // slideshow
            if( this.options.autoplay ) {

                this._startSlideshow();

            }

        },
        // gets the current container width & height
        _getSize : function() {

            this.size = {
                width : this.$elWrapper.outerWidth( true ),
                height : this.$elWrapper.outerHeight( true )
            };

        },
        _layout : function() {

            this.$slideWrapper = $( '<div class="sl-slides-wrapper" />' );

            // wrap the slides
            this.$slides.wrapAll( this.$slideWrapper ).each( function( i ) {

                var $slide = $( this ),
                    // vertical || horizontal
                    orientation = $slide.data( 'orientation' );

                $slide.addClass( 'sl-slide-' + orientation )
                      .children()
                      .wrapAll( '<div class="sl-content-wrapper" />' )
                      .wrapAll( '<div class="sl-content" />' );

            } );

            // set the right size of the slider/slides for the current window size
            this._setSize();
            // show first slide
            this.$slides.eq( this.current ).show();

        },
        _navigate : function( dir, pos ) {

            if( this.isAnimating || this.slidesCount < 2 ) {

                return false;

            }

            this.isAnimating = true;

            var self = this,
                $currentSlide = this.$slides.eq( this.current );

            // if position is passed
            if( pos !== undefined ) {

                this.current = pos;

            }
            // if not check the boundaries
            else if( dir === 'next' ) {

                this.current = this.current < this.slidesCount - 1 ? ++this.current : 0;

            }
            else if( dir === 'prev' ) {

                this.current = this.current > 0 ? --this.current : this.slidesCount - 1;

            }

            this.options.onBeforeChange( $currentSlide, this.current );

            // next slide to be shown
            var $nextSlide = this.$slides.eq( this.current ),
                // the slide we want to cut and animate
                $movingSlide = ( dir === 'next' ) ? $currentSlide : $nextSlide,

                // the following are the data attrs set for each slide
                configData = $movingSlide.data(),
                config = {};

            config.orientation = configData.orientation || 'horizontal';
            config.slice1angle = configData.slice1Rotation || 0;
            config.slice1scale = configData.slice1Scale || 1;
            config.slice2angle = configData.slice2Rotation || 0;
            config.slice2scale = configData.slice2Scale || 1;

            this._validateValues( config );

            var resetStyle = {
                    'transform' : 'translate(0%,0%) rotate(0deg) scale(1)',
                    'opacity' : 1
                },
                // slice1 style
                slice1Style = {
                    'transform' : 'translateY(-' + this.options.translateFactor + '%) rotate(' + config.slice1angle + 'deg) scale(' + config.slice1scale + ')',
                },
                // slice2 style
                slice2Style = config.orientation === 'horizontal' ? {
                    'transform' : 'rotate(' + config.slice2angle + 'deg) scale(' + config.slice2scale + ')'
                } : {
                    'transform' : 'rotate(' + config.slice2angle + 'deg) scale(' + config.slice2scale + ')'
                },
                //Copy style
                copyStyle = {
                    'opacity': 0
                },
                imageStyle = {
                    'transform' : 'translateY(' + this.options.translateFactor + '%) rotate(' + config.slice1angle + 'deg) scale(' + config.slice1scale + ')'
                };

            if( this.options.optOpacity ) {

                slice1Style.opacity = 0;
                slice2Style.opacity = 0;

            }

            // we are adding the classes sl-trans-elems and sl-trans-back-elems to the slide that is either coming "next"
            // or going "prev" according to the direction.
            // the idea is to make it more interesting by giving some animations to the respective slide's elements
            //( dir === 'next' ) ? $nextSlide.addClass( 'sl-trans-elems' ) : $currentSlide.addClass( 'sl-trans-back-elems' );

            $currentSlide.removeClass( 'sl-trans-elems' );

            var transitionProp1 = {
                    'transition' : 'all ' + this.options.speed + 'ms ease-in-out'
                },
                transitionProp2 = {
                    'transition' : 'all ' + Math.round(this.options.speed * 0.15).toString() + 'ms ease-in-out'
                },
                transitionProp2Delay = {
                    'transition-delay' : Math.round(this.options.speed * 0.85).toString() + 'ms'
                },
                copyTransitionProp = {
                    'transition' : 'all ' + Math.round(this.options.speed * 0.4).toString() + 'ms ease-in-out',
                },
                copyTransitionDelayProp = {
                    'transition-delay' : Math.round(this.options.speed * 0.6).toString() + 'ms'
                };

            // add the 2 slices and animate them
            $movingSlide.css( 'z-index', this.slidesCount );
            var slice1 =  $movingSlide.find( 'div.sl-content-wrapper' )
                                      .wrap( $( '<div class="sl-content-slice" />' ) )
                                      .parent();
                      //.css('top', 0)
                     // .css('transition', 'none');
                //slice2 = slice1.clone().appendTo( $movingSlide );

                slice1.cond(
                    dir === 'prev',
                        function() {

                            var slice = this,
                                heroCopy = slice.find('.hero-copy'),
                                bgImage = slice.find('.bg-img');

                            //setTimeout(function() {
                                slice.css( slice1Style )
                                     .css( transitionProp1 )
                                     .css('height', Math.round(slice.parent().height() * 1.8).toString() + 'px');

                                bgImage.css( imageStyle ).css( transitionProp1 );
                                heroCopy.css(copyStyle).css(copyTransitionProp).css(copyTransitionDelayProp);

                                setTimeout( function() {
                                    heroCopy.css(resetStyle).on( self.transEndEventName, function(e) {
                                        e.stopPropagation();
                                    });
                                    bgImage.css( resetStyle ).on( self.transEndEventName, function(e) {
                                        e.stopPropagation();
                                    });

                                    slice.css( resetStyle ).on( self.transEndEventName, function(e) {

                                        if ($(e.target === slice)) {
                                            self._onEndNavigate( slice, $currentSlide, dir );
                                        }
                                    } );

                                }, 50 );
                            //});
                        },

                        function() {

                            var slice = this,
                                heroCopy = slice.find('.hero-copy'),
                                bgImage = slice.find('.bg-img');

                            slice.css('height', Math.round(slice.parent().height() * 1.50).toString() + 'px');

                            setTimeout(function() {
                                slice.css( resetStyle )
                                     .css( transitionProp1 );

                                bgImage.css( resetStyle ).css( transitionProp1 );
                                heroCopy.css(resetStyle).css(copyTransitionProp);

                                setTimeout( function() {
                                    heroCopy.css(copyStyle).on( self.transEndEventName, function(e) {
                                        e.stopPropagation();
                                    });
                                    bgImage.css( imageStyle ).on( self.transEndEventName, function(e) {
                                        e.stopPropagation();
                                    });

                                    slice.css( slice1Style ).on( self.transEndEventName, function(e) {
                                        self._onEndNavigate( slice, $currentSlide, dir );
                                    });

                                }, 50 );
                            });


                        }
                );



            /*slice2.cond(
                dir === 'prev',

                function() {
                    var slice = this;

                    this.css( slice2Style ).css( transitionProp2 ).css( transitionProp2Delay );

                    setTimeout( function() {
                        $currentSlide.addClass( 'sl-trans-back-elems' );
                        slice.css( resetStyle );
                    }, 50 );
                },

                function() {
                    var slice = this;

                    this.css( resetStyle ).css( transitionProp2 );
                    slice.find('.hero-copy').css('opacity', 0);

                    setTimeout( function() {
                        $nextSlide.addClass( 'sl-trans-elems' );
                        slice.css( slice2Style );
                    }, 50 );
                }
            );*/

            $nextSlide.show();

        },
        _validateValues : function( config ) {

            // OK, so we are restricting the angles and scale values here.
            // This is to avoid the slices wrong sides to be shown.
            // you can adjust these values as you wish but make sure you also ajust the
            // paddings of the slides and also the options.translateFactor value and scale data attrs
            if( config.slice1angle > this.options.maxAngle || config.slice1angle < -this.options.maxAngle ) {

                config.slice1angle = this.options.maxAngle;

            }
            if( config.slice2angle > this.options.maxAngle  || config.slice2angle < -this.options.maxAngle ) {

                config.slice2angle = this.options.maxAngle;

            }
            if( config.slice1scale > this.options.maxScale || config.slice1scale <= 0 ) {

                config.slice1scale = this.options.maxScale;

            }
            if( config.slice2scale > this.options.maxScale || config.slice2scale <= 0 ) {

                config.slice2scale = this.options.maxScale;

            }
            if( config.orientation !== 'vertical' && config.orientation !== 'horizontal' ) {

                config.orientation = 'horizontal';

            }

        },
        _onEndNavigate : function( $slice, $oldSlide, dir ) {

            // reset previous slide's style after next slide is shown
            var $slide = $slice.parent(),
                removeClasses = 'sl-trans-elems sl-trans-back-elems',
                resetStyle = {
                    'transform' : 'translate(0%,0%) rotate(0deg) scale(1)',
                    'opacity' : 1
                };

            // remove second slide's slice
            //$slice.remove();
            // unwrap..
            $slide.css( 'z-index', 1 )
                  .find( 'div.sl-content-wrapper' )
                  .unwrap();

            $slide.find('.bg-img').css( resetStyle );
            $slide.find('.hero-copy').css('opacity', 1);

            // hide previous current slide
            $oldSlide.hide().removeClass( removeClasses );
            $slide.removeClass( removeClasses );
            // now we can navigate again..
            this.isAnimating = false;
            this.options.onAfterChange( $slide, this.current );

        },
        _setSize : function() {

            // the slider and content wrappers will have the window's width and height
            var cssStyle = {
                width : this.size.width,
                height : this.size.height
            };

            this.$el.css( cssStyle ).find( 'div.sl-content-wrapper' ).css( cssStyle );

        },
        _loadEvents : function() {

            var self = this;

            $window.on( 'debouncedresize.slitslider', function( event ) {

                // update size values
                self._getSize();
                // set the sizes again
                self._setSize();

            } );

            if ( this.options.keyboard ) {

                $document.on( 'keydown.slitslider', function(e) {

                    var keyCode = e.keyCode || e.which,
                        arrow = {
                            left: 37,
                            up: 38,
                            right: 39,
                            down: 40
                        };

                    switch (keyCode) {

                        case arrow.left :

                            self._stopSlideshow();
                            self._navigate( 'prev' );
                            break;

                        case arrow.right :

                            self._stopSlideshow();
                            self._navigate( 'next' );
                            break;

                    }

                } );

            }

        },
        _startSlideshow: function() {

            var self = this;

            this.slideshow = setTimeout( function() {

                self._navigate( 'next' );

                if ( self.options.autoplay ) {

                    self._startSlideshow();

                }

            }, this.options.interval );

        },
        _stopSlideshow: function() {

            if ( this.options.autoplay ) {

                clearTimeout( this.slideshow );
                this.isPlaying = false;
                this.options.autoplay = false;

            }

        },
        _destroy : function( callback ) {

            this.$el.off( '.slitslider' ).removeData( 'slitslider' );
            $window.off( '.slitslider' );
            $document.off( '.slitslider' );
            this.$slides.each( function( i ) {

                var $slide = $( this ),
                    $content = $slide.find( 'div.sl-content' ).children();

                $content.appendTo( $slide );
                $slide.children( 'div.sl-content-wrapper' ).remove();

            } );
            this.$slides.unwrap( this.$slideWrapper ).hide();
            this.$slides.eq( 0 ).show();
            if( callback ) {

                callback.call();

            }

        },
        // public methos: adds more slides to the slider
        add : function( $slides, callback ) {

            this.$slides = this.$slides.add( $slides );

            var self = this;


            $slides.each( function( i ) {

                var $slide = $( this ),
                    // vertical || horizontal
                    orientation = $slide.data( 'orientation' );

                $slide.hide().addClass( 'sl-slide-' + orientation )
                      .children()
                      .wrapAll( '<div class="sl-content-wrapper" />' )
                      .wrapAll( '<div class="sl-content" />' )
                      .end()
                      .appendTo( self.$el.find( 'div.sl-slides-wrapper' ) );

            } );

            this._setSize();

            this.slidesCount = this.$slides.length;

            if ( callback ) {

                callback.call( $items );

            }

        },
        // public method: shows next slide
        next : function() {

            this._stopSlideshow();
            this._navigate( 'next' );

        },
        // public method: shows previous slide
        previous : function() {

            this._stopSlideshow();
            this._navigate( 'prev' );

        },
        // public method: goes to a specific slide
        jump : function( pos ) {

            pos -= 1;

            if( pos === this.current || pos >= this.slidesCount || pos < 0 ) {

                return false;

            }

            this._stopSlideshow();
            this._navigate( pos > this.current ? 'next' : 'prev', pos );

        },
        // public method: starts the slideshow
        // any call to next(), previous() or jump() will stop the slideshow
        play : function() {

            if( !this.isPlaying ) {

                this.isPlaying = true;

                this._navigate( 'next' );
                this.options.autoplay = true;
                this._startSlideshow();

            }

        },
        // public method: pauses the slideshow
        pause : function() {

            if( this.isPlaying ) {

                this._stopSlideshow();

            }

        },
        // public method: check if isAnimating is true
        isActive : function() {

            return this.isAnimating;

        },
        // publicc methos: destroys the slicebox instance
        destroy : function( callback ) {

            this._destroy( callback );

        }

    };

    var logError = function( message ) {

        if ( window.console ) {

            window.console.error( message );

        }

    };

    $.fn.slitslider = function( options ) {

        var self = $.data( this, 'slitslider' );

        if ( typeof options === 'string' ) {

            var args = Array.prototype.slice.call( arguments, 1 );

            this.each(function() {

                if ( !self ) {

                    logError( "cannot call methods on slitslider prior to initialization; " +
                    "attempted to call method '" + options + "'" );
                    return;

                }

                if ( !$.isFunction( self[options] ) || options.charAt(0) === "_" ) {

                    logError( "no such method '" + options + "' for slitslider self" );
                    return;

                }

                self[ options ].apply( self, args );

            });

        }
        else {

            this.each(function() {

                if ( self ) {

                    self._init();

                }
                else {

                    self = $.data( this, 'slitslider', new $.Slitslider( options, this ) );

                }

            });

        }

        return self;

    };

} )( jQuery, window );
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzY3JvbGwuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBqcXVlcnkuc2xpdHNsaWRlci5qcyB2MS4xLjBcbiAqIGh0dHA6Ly93d3cuY29kcm9wcy5jb21cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICpcbiAqIENvcHlyaWdodCAyMDEyLCBDb2Ryb3BzXG4gKiBodHRwOi8vd3d3LmNvZHJvcHMuY29tXG4gKi9cblxuOyggZnVuY3Rpb24oICQsIHdpbmRvdywgdW5kZWZpbmVkICkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLypcbiAgICAqIGRlYm91bmNlZHJlc2l6ZTogc3BlY2lhbCBqUXVlcnkgZXZlbnQgdGhhdCBoYXBwZW5zIG9uY2UgYWZ0ZXIgYSB3aW5kb3cgcmVzaXplXG4gICAgKlxuICAgICogbGF0ZXN0IHZlcnNpb24gYW5kIGNvbXBsZXRlIFJFQURNRSBhdmFpbGFibGUgb24gR2l0aHViOlxuICAgICogaHR0cHM6Ly9naXRodWIuY29tL2xvdWlzcmVtaS9qcXVlcnktc21hcnRyZXNpemUvYmxvYi9tYXN0ZXIvanF1ZXJ5LmRlYm91bmNlZHJlc2l6ZS5qc1xuICAgICpcbiAgICAqIENvcHlyaWdodCAyMDExIEBsb3Vpc19yZW1pXG4gICAgKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gICAgKi9cbiAgICB2YXIgJGV2ZW50ID0gJC5ldmVudCxcbiAgICAkc3BlY2lhbCxcbiAgICByZXNpemVUaW1lb3V0O1xuXG4gICAgJHNwZWNpYWwgPSAkZXZlbnQuc3BlY2lhbC5kZWJvdW5jZWRyZXNpemUgPSB7XG4gICAgICAgIHNldHVwOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQoIHRoaXMgKS5vbiggXCJyZXNpemVcIiwgJHNwZWNpYWwuaGFuZGxlciApO1xuICAgICAgICB9LFxuICAgICAgICB0ZWFyZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKCB0aGlzICkub2ZmKCBcInJlc2l6ZVwiLCAkc3BlY2lhbC5oYW5kbGVyICk7XG4gICAgICAgIH0sXG4gICAgICAgIGhhbmRsZXI6IGZ1bmN0aW9uKCBldmVudCwgZXhlY0FzYXAgKSB7XG4gICAgICAgICAgICAvLyBTYXZlIHRoZSBjb250ZXh0XG4gICAgICAgICAgICB2YXIgY29udGV4dCA9IHRoaXMsXG4gICAgICAgICAgICAgICAgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgICAgICAgICBkaXNwYXRjaCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBzZXQgY29ycmVjdCBldmVudCB0eXBlXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnR5cGUgPSBcImRlYm91bmNlZHJlc2l6ZVwiO1xuICAgICAgICAgICAgICAgICAgICAkZXZlbnQuZGlzcGF0Y2guYXBwbHkoIGNvbnRleHQsIGFyZ3MgKTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAoIHJlc2l6ZVRpbWVvdXQgKSB7XG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KCByZXNpemVUaW1lb3V0ICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGV4ZWNBc2FwID9cbiAgICAgICAgICAgICAgICBkaXNwYXRjaCgpIDpcbiAgICAgICAgICAgICAgICByZXNpemVUaW1lb3V0ID0gc2V0VGltZW91dCggZGlzcGF0Y2gsICRzcGVjaWFsLnRocmVzaG9sZCApO1xuICAgICAgICB9LFxuICAgICAgICB0aHJlc2hvbGQ6IDIwXG4gICAgfTtcblxuICAgIC8vIGdsb2JhbFxuICAgIHZhciAkd2luZG93ID0gJCggd2luZG93ICksXG4gICAgICAgICRkb2N1bWVudCA9ICQoIGRvY3VtZW50ICksXG4gICAgICAgIE1vZGVybml6ciA9IHdpbmRvdy5Nb2Rlcm5penI7XG5cbiAgICAkLlNsaXRzbGlkZXIgPSBmdW5jdGlvbiggb3B0aW9ucywgZWxlbWVudCApIHtcblxuICAgICAgICB0aGlzLiRlbFdyYXBwZXIgPSAkKCBlbGVtZW50ICk7XG4gICAgICAgIHRoaXMuX2luaXQoIG9wdGlvbnMgKTtcblxuICAgIH07XG5cbiAgICAkLlNsaXRzbGlkZXIuZGVmYXVsdHMgPSB7XG4gICAgICAgIC8vIHRyYW5zaXRpb25zIHNwZWVkXG4gICAgICAgIHNwZWVkIDogNTAwLFxuICAgICAgICAvLyBpZiB0cnVlIHRoZSBpdGVtJ3Mgc2xpY2VzIHdpbGwgYWxzbyBhbmltYXRlIHRoZSBvcGFjaXR5IHZhbHVlXG4gICAgICAgIG9wdE9wYWNpdHkgOiB0cnVlLFxuICAgICAgICAvLyBhbW91bnQgKCUpIHRvIHRyYW5zbGF0ZSBib3RoIHNsaWNlcyAtIGFkanVzdCBhcyBuZWNlc3NhcnlcbiAgICAgICAgdHJhbnNsYXRlRmFjdG9yIDogMTAwLFxuICAgICAgICAvLyBtYXhpbXVtIHBvc3NpYmxlIGFuZ2xlXG4gICAgICAgIG1heEFuZ2xlIDogMjUsXG4gICAgICAgIC8vIG1heGltdW0gcG9zc2libGUgc2NhbGVcbiAgICAgICAgbWF4U2NhbGUgOiAyLFxuICAgICAgICAvLyBzbGlkZXNob3cgb24gLyBvZmZcbiAgICAgICAgYXV0b3BsYXkgOiB0cnVlLFxuICAgICAgICAvLyBrZXlib2FyZCBuYXZpZ2F0aW9uXG4gICAgICAgIGtleWJvYXJkIDogdHJ1ZSxcbiAgICAgICAgLy8gdGltZSBiZXR3ZWVuIHRyYW5zaXRpb25zXG4gICAgICAgIGludGVydmFsIDogNjAwMCxcbiAgICAgICAgLy8gY2FsbGJhY2tzXG4gICAgICAgIG9uQmVmb3JlQ2hhbmdlIDogZnVuY3Rpb24oIHNsaWRlLCBpZHggKSB7IHJldHVybiBmYWxzZTsgfSxcbiAgICAgICAgb25BZnRlckNoYW5nZSA6IGZ1bmN0aW9uKCBzbGlkZSwgaWR4ICkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICB9O1xuXG4gICAgJC5TbGl0c2xpZGVyLnByb3RvdHlwZSA9IHtcblxuICAgICAgICBfaW5pdCA6IGZ1bmN0aW9uKCBvcHRpb25zICkge1xuXG4gICAgICAgICAgICAvLyBvcHRpb25zXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCggdHJ1ZSwge30sICQuU2xpdHNsaWRlci5kZWZhdWx0cywgb3B0aW9ucyApO1xuXG4gICAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vdHdpdHRlci9ib290c3RyYXAvaXNzdWVzLzI4NzBcbiAgICAgICAgICAgIHRoaXMudHJhbnNFbmRFdmVudE5hbWVzID0ge1xuICAgICAgICAgICAgICAgICdXZWJraXRUcmFuc2l0aW9uJyA6ICd3ZWJraXRUcmFuc2l0aW9uRW5kJyxcbiAgICAgICAgICAgICAgICAnTW96VHJhbnNpdGlvbicgOiAndHJhbnNpdGlvbmVuZCcsXG4gICAgICAgICAgICAgICAgJ09UcmFuc2l0aW9uJyA6ICdvVHJhbnNpdGlvbkVuZCcsXG4gICAgICAgICAgICAgICAgJ21zVHJhbnNpdGlvbicgOiAnTVNUcmFuc2l0aW9uRW5kJyxcbiAgICAgICAgICAgICAgICAndHJhbnNpdGlvbicgOiAndHJhbnNpdGlvbmVuZCdcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLnRyYW5zRW5kRXZlbnROYW1lID0gdGhpcy50cmFuc0VuZEV2ZW50TmFtZXNbIE1vZGVybml6ci5wcmVmaXhlZCggJ3RyYW5zaXRpb24nICkgXTtcbiAgICAgICAgICAgIC8vIHN1cG9ydCBmb3IgY3NzIDNkIHRyYW5zZm9ybXMgYW5kIGNzcyB0cmFuc2l0aW9uc1xuICAgICAgICAgICAgdGhpcy5zdXBwb3J0ID0gTW9kZXJuaXpyLmNzc3RyYW5zaXRpb25zICYmIE1vZGVybml6ci5jc3N0cmFuc2Zvcm1zM2Q7XG4gICAgICAgICAgICAvLyB0aGUgc2xpZGVyXG4gICAgICAgICAgICB0aGlzLiRlbCA9IHRoaXMuJGVsV3JhcHBlci5jaGlsZHJlbiggJy5zbC1zbGlkZXInICk7XG4gICAgICAgICAgICAvLyB0aGUgc2xpZGVzXG4gICAgICAgICAgICB0aGlzLiRzbGlkZXMgPSB0aGlzLiRlbC5jaGlsZHJlbiggJy5zbC1zbGlkZScgKS5oaWRlKCk7XG4gICAgICAgICAgICAvLyB0b3RhbCBzbGlkZXNcbiAgICAgICAgICAgIHRoaXMuc2xpZGVzQ291bnQgPSB0aGlzLiRzbGlkZXMubGVuZ3RoO1xuICAgICAgICAgICAgLy8gY3VycmVudCBzbGlkZVxuICAgICAgICAgICAgdGhpcy5jdXJyZW50ID0gMDtcbiAgICAgICAgICAgIC8vIGNvbnRyb2wgaWYgaXQncyBhbmltYXRpbmdcbiAgICAgICAgICAgIHRoaXMuaXNBbmltYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIC8vIGdldCBjb250YWluZXIgc2l6ZVxuICAgICAgICAgICAgdGhpcy5fZ2V0U2l6ZSgpO1xuICAgICAgICAgICAgLy8gbGF5b3V0XG4gICAgICAgICAgICB0aGlzLl9sYXlvdXQoKTtcbiAgICAgICAgICAgIC8vIGxvYWQgc29tZSBldmVudHNcbiAgICAgICAgICAgIHRoaXMuX2xvYWRFdmVudHMoKTtcbiAgICAgICAgICAgIC8vIHNsaWRlc2hvd1xuICAgICAgICAgICAgaWYoIHRoaXMub3B0aW9ucy5hdXRvcGxheSApIHtcblxuICAgICAgICAgICAgICAgIHRoaXMuX3N0YXJ0U2xpZGVzaG93KCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9LFxuICAgICAgICAvLyBnZXRzIHRoZSBjdXJyZW50IGNvbnRhaW5lciB3aWR0aCAmIGhlaWdodFxuICAgICAgICBfZ2V0U2l6ZSA6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB0aGlzLnNpemUgPSB7XG4gICAgICAgICAgICAgICAgd2lkdGggOiB0aGlzLiRlbFdyYXBwZXIub3V0ZXJXaWR0aCggdHJ1ZSApLFxuICAgICAgICAgICAgICAgIGhlaWdodCA6IHRoaXMuJGVsV3JhcHBlci5vdXRlckhlaWdodCggdHJ1ZSApXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0sXG4gICAgICAgIF9sYXlvdXQgOiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdGhpcy4kc2xpZGVXcmFwcGVyID0gJCggJzxkaXYgY2xhc3M9XCJzbC1zbGlkZXMtd3JhcHBlclwiIC8+JyApO1xuXG4gICAgICAgICAgICAvLyB3cmFwIHRoZSBzbGlkZXNcbiAgICAgICAgICAgIHRoaXMuJHNsaWRlcy53cmFwQWxsKCB0aGlzLiRzbGlkZVdyYXBwZXIgKS5lYWNoKCBmdW5jdGlvbiggaSApIHtcblxuICAgICAgICAgICAgICAgIHZhciAkc2xpZGUgPSAkKCB0aGlzICksXG4gICAgICAgICAgICAgICAgICAgIC8vIHZlcnRpY2FsIHx8IGhvcml6b250YWxcbiAgICAgICAgICAgICAgICAgICAgb3JpZW50YXRpb24gPSAkc2xpZGUuZGF0YSggJ29yaWVudGF0aW9uJyApO1xuXG4gICAgICAgICAgICAgICAgJHNsaWRlLmFkZENsYXNzKCAnc2wtc2xpZGUtJyArIG9yaWVudGF0aW9uIClcbiAgICAgICAgICAgICAgICAgICAgICAuY2hpbGRyZW4oKVxuICAgICAgICAgICAgICAgICAgICAgIC53cmFwQWxsKCAnPGRpdiBjbGFzcz1cInNsLWNvbnRlbnQtd3JhcHBlclwiIC8+JyApXG4gICAgICAgICAgICAgICAgICAgICAgLndyYXBBbGwoICc8ZGl2IGNsYXNzPVwic2wtY29udGVudFwiIC8+JyApO1xuXG4gICAgICAgICAgICB9ICk7XG5cbiAgICAgICAgICAgIC8vIHNldCB0aGUgcmlnaHQgc2l6ZSBvZiB0aGUgc2xpZGVyL3NsaWRlcyBmb3IgdGhlIGN1cnJlbnQgd2luZG93IHNpemVcbiAgICAgICAgICAgIHRoaXMuX3NldFNpemUoKTtcbiAgICAgICAgICAgIC8vIHNob3cgZmlyc3Qgc2xpZGVcbiAgICAgICAgICAgIHRoaXMuJHNsaWRlcy5lcSggdGhpcy5jdXJyZW50ICkuc2hvdygpO1xuXG4gICAgICAgIH0sXG4gICAgICAgIF9uYXZpZ2F0ZSA6IGZ1bmN0aW9uKCBkaXIsIHBvcyApIHtcblxuICAgICAgICAgICAgaWYoIHRoaXMuaXNBbmltYXRpbmcgfHwgdGhpcy5zbGlkZXNDb3VudCA8IDIgKSB7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5pc0FuaW1hdGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgICAgICAkY3VycmVudFNsaWRlID0gdGhpcy4kc2xpZGVzLmVxKCB0aGlzLmN1cnJlbnQgKTtcblxuICAgICAgICAgICAgLy8gaWYgcG9zaXRpb24gaXMgcGFzc2VkXG4gICAgICAgICAgICBpZiggcG9zICE9PSB1bmRlZmluZWQgKSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnQgPSBwb3M7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGlmIG5vdCBjaGVjayB0aGUgYm91bmRhcmllc1xuICAgICAgICAgICAgZWxzZSBpZiggZGlyID09PSAnbmV4dCcgKSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnQgPSB0aGlzLmN1cnJlbnQgPCB0aGlzLnNsaWRlc0NvdW50IC0gMSA/ICsrdGhpcy5jdXJyZW50IDogMDtcblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiggZGlyID09PSAncHJldicgKSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnQgPSB0aGlzLmN1cnJlbnQgPiAwID8gLS10aGlzLmN1cnJlbnQgOiB0aGlzLnNsaWRlc0NvdW50IC0gMTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMub25CZWZvcmVDaGFuZ2UoICRjdXJyZW50U2xpZGUsIHRoaXMuY3VycmVudCApO1xuXG4gICAgICAgICAgICAvLyBuZXh0IHNsaWRlIHRvIGJlIHNob3duXG4gICAgICAgICAgICB2YXIgJG5leHRTbGlkZSA9IHRoaXMuJHNsaWRlcy5lcSggdGhpcy5jdXJyZW50ICksXG4gICAgICAgICAgICAgICAgLy8gdGhlIHNsaWRlIHdlIHdhbnQgdG8gY3V0IGFuZCBhbmltYXRlXG4gICAgICAgICAgICAgICAgJG1vdmluZ1NsaWRlID0gKCBkaXIgPT09ICduZXh0JyApID8gJGN1cnJlbnRTbGlkZSA6ICRuZXh0U2xpZGUsXG5cbiAgICAgICAgICAgICAgICAvLyB0aGUgZm9sbG93aW5nIGFyZSB0aGUgZGF0YSBhdHRycyBzZXQgZm9yIGVhY2ggc2xpZGVcbiAgICAgICAgICAgICAgICBjb25maWdEYXRhID0gJG1vdmluZ1NsaWRlLmRhdGEoKSxcbiAgICAgICAgICAgICAgICBjb25maWcgPSB7fTtcblxuICAgICAgICAgICAgY29uZmlnLm9yaWVudGF0aW9uID0gY29uZmlnRGF0YS5vcmllbnRhdGlvbiB8fCAnaG9yaXpvbnRhbCc7XG4gICAgICAgICAgICBjb25maWcuc2xpY2UxYW5nbGUgPSBjb25maWdEYXRhLnNsaWNlMVJvdGF0aW9uIHx8IDA7XG4gICAgICAgICAgICBjb25maWcuc2xpY2Uxc2NhbGUgPSBjb25maWdEYXRhLnNsaWNlMVNjYWxlIHx8IDE7XG4gICAgICAgICAgICBjb25maWcuc2xpY2UyYW5nbGUgPSBjb25maWdEYXRhLnNsaWNlMlJvdGF0aW9uIHx8IDA7XG4gICAgICAgICAgICBjb25maWcuc2xpY2Uyc2NhbGUgPSBjb25maWdEYXRhLnNsaWNlMlNjYWxlIHx8IDE7XG5cbiAgICAgICAgICAgIHRoaXMuX3ZhbGlkYXRlVmFsdWVzKCBjb25maWcgKTtcblxuICAgICAgICAgICAgdmFyIHJlc2V0U3R5bGUgPSB7XG4gICAgICAgICAgICAgICAgICAgICd0cmFuc2Zvcm0nIDogJ3RyYW5zbGF0ZSgwJSwwJSkgcm90YXRlKDBkZWcpIHNjYWxlKDEpJyxcbiAgICAgICAgICAgICAgICAgICAgJ29wYWNpdHknIDogMVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgLy8gc2xpY2UxIHN0eWxlXG4gICAgICAgICAgICAgICAgc2xpY2UxU3R5bGUgPSB7XG4gICAgICAgICAgICAgICAgICAgICd0cmFuc2Zvcm0nIDogJ3RyYW5zbGF0ZVkoLScgKyB0aGlzLm9wdGlvbnMudHJhbnNsYXRlRmFjdG9yICsgJyUpIHJvdGF0ZSgnICsgY29uZmlnLnNsaWNlMWFuZ2xlICsgJ2RlZykgc2NhbGUoJyArIGNvbmZpZy5zbGljZTFzY2FsZSArICcpJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8vIHNsaWNlMiBzdHlsZVxuICAgICAgICAgICAgICAgIHNsaWNlMlN0eWxlID0gY29uZmlnLm9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcgPyB7XG4gICAgICAgICAgICAgICAgICAgICd0cmFuc2Zvcm0nIDogJ3JvdGF0ZSgnICsgY29uZmlnLnNsaWNlMmFuZ2xlICsgJ2RlZykgc2NhbGUoJyArIGNvbmZpZy5zbGljZTJzY2FsZSArICcpJ1xuICAgICAgICAgICAgICAgIH0gOiB7XG4gICAgICAgICAgICAgICAgICAgICd0cmFuc2Zvcm0nIDogJ3JvdGF0ZSgnICsgY29uZmlnLnNsaWNlMmFuZ2xlICsgJ2RlZykgc2NhbGUoJyArIGNvbmZpZy5zbGljZTJzY2FsZSArICcpJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgLy9Db3B5IHN0eWxlXG4gICAgICAgICAgICAgICAgY29weVN0eWxlID0ge1xuICAgICAgICAgICAgICAgICAgICAnb3BhY2l0eSc6IDBcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGltYWdlU3R5bGUgPSB7XG4gICAgICAgICAgICAgICAgICAgICd0cmFuc2Zvcm0nIDogJ3RyYW5zbGF0ZVkoJyArIHRoaXMub3B0aW9ucy50cmFuc2xhdGVGYWN0b3IgKyAnJSkgcm90YXRlKCcgKyBjb25maWcuc2xpY2UxYW5nbGUgKyAnZGVnKSBzY2FsZSgnICsgY29uZmlnLnNsaWNlMXNjYWxlICsgJyknXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYoIHRoaXMub3B0aW9ucy5vcHRPcGFjaXR5ICkge1xuXG4gICAgICAgICAgICAgICAgc2xpY2UxU3R5bGUub3BhY2l0eSA9IDA7XG4gICAgICAgICAgICAgICAgc2xpY2UyU3R5bGUub3BhY2l0eSA9IDA7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gd2UgYXJlIGFkZGluZyB0aGUgY2xhc3NlcyBzbC10cmFucy1lbGVtcyBhbmQgc2wtdHJhbnMtYmFjay1lbGVtcyB0byB0aGUgc2xpZGUgdGhhdCBpcyBlaXRoZXIgY29taW5nIFwibmV4dFwiXG4gICAgICAgICAgICAvLyBvciBnb2luZyBcInByZXZcIiBhY2NvcmRpbmcgdG8gdGhlIGRpcmVjdGlvbi5cbiAgICAgICAgICAgIC8vIHRoZSBpZGVhIGlzIHRvIG1ha2UgaXQgbW9yZSBpbnRlcmVzdGluZyBieSBnaXZpbmcgc29tZSBhbmltYXRpb25zIHRvIHRoZSByZXNwZWN0aXZlIHNsaWRlJ3MgZWxlbWVudHNcbiAgICAgICAgICAgIC8vKCBkaXIgPT09ICduZXh0JyApID8gJG5leHRTbGlkZS5hZGRDbGFzcyggJ3NsLXRyYW5zLWVsZW1zJyApIDogJGN1cnJlbnRTbGlkZS5hZGRDbGFzcyggJ3NsLXRyYW5zLWJhY2stZWxlbXMnICk7XG5cbiAgICAgICAgICAgICRjdXJyZW50U2xpZGUucmVtb3ZlQ2xhc3MoICdzbC10cmFucy1lbGVtcycgKTtcblxuICAgICAgICAgICAgdmFyIHRyYW5zaXRpb25Qcm9wMSA9IHtcbiAgICAgICAgICAgICAgICAgICAgJ3RyYW5zaXRpb24nIDogJ2FsbCAnICsgdGhpcy5vcHRpb25zLnNwZWVkICsgJ21zIGVhc2UtaW4tb3V0J1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvblByb3AyID0ge1xuICAgICAgICAgICAgICAgICAgICAndHJhbnNpdGlvbicgOiAnYWxsICcgKyBNYXRoLnJvdW5kKHRoaXMub3B0aW9ucy5zcGVlZCAqIDAuMTUpLnRvU3RyaW5nKCkgKyAnbXMgZWFzZS1pbi1vdXQnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uUHJvcDJEZWxheSA9IHtcbiAgICAgICAgICAgICAgICAgICAgJ3RyYW5zaXRpb24tZGVsYXknIDogTWF0aC5yb3VuZCh0aGlzLm9wdGlvbnMuc3BlZWQgKiAwLjg1KS50b1N0cmluZygpICsgJ21zJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY29weVRyYW5zaXRpb25Qcm9wID0ge1xuICAgICAgICAgICAgICAgICAgICAndHJhbnNpdGlvbicgOiAnYWxsICcgKyBNYXRoLnJvdW5kKHRoaXMub3B0aW9ucy5zcGVlZCAqIDAuNCkudG9TdHJpbmcoKSArICdtcyBlYXNlLWluLW91dCcsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBjb3B5VHJhbnNpdGlvbkRlbGF5UHJvcCA9IHtcbiAgICAgICAgICAgICAgICAgICAgJ3RyYW5zaXRpb24tZGVsYXknIDogTWF0aC5yb3VuZCh0aGlzLm9wdGlvbnMuc3BlZWQgKiAwLjYpLnRvU3RyaW5nKCkgKyAnbXMnXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gYWRkIHRoZSAyIHNsaWNlcyBhbmQgYW5pbWF0ZSB0aGVtXG4gICAgICAgICAgICAkbW92aW5nU2xpZGUuY3NzKCAnei1pbmRleCcsIHRoaXMuc2xpZGVzQ291bnQgKTtcbiAgICAgICAgICAgIHZhciBzbGljZTEgPSAgJG1vdmluZ1NsaWRlLmZpbmQoICdkaXYuc2wtY29udGVudC13cmFwcGVyJyApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC53cmFwKCAkKCAnPGRpdiBjbGFzcz1cInNsLWNvbnRlbnQtc2xpY2VcIiAvPicgKSApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5wYXJlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAvLy5jc3MoJ3RvcCcsIDApXG4gICAgICAgICAgICAgICAgICAgICAvLyAuY3NzKCd0cmFuc2l0aW9uJywgJ25vbmUnKTtcbiAgICAgICAgICAgICAgICAvL3NsaWNlMiA9IHNsaWNlMS5jbG9uZSgpLmFwcGVuZFRvKCAkbW92aW5nU2xpZGUgKTtcblxuICAgICAgICAgICAgICAgIHNsaWNlMS5jb25kKFxuICAgICAgICAgICAgICAgICAgICBkaXIgPT09ICdwcmV2JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNsaWNlID0gdGhpcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVyb0NvcHkgPSBzbGljZS5maW5kKCcuaGVyby1jb3B5JyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJnSW1hZ2UgPSBzbGljZS5maW5kKCcuYmctaW1nJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3NldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNsaWNlLmNzcyggc2xpY2UxU3R5bGUgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoIHRyYW5zaXRpb25Qcm9wMSApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNzcygnaGVpZ2h0JywgTWF0aC5yb3VuZChzbGljZS5wYXJlbnQoKS5oZWlnaHQoKSAqIDEuOCkudG9TdHJpbmcoKSArICdweCcpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJnSW1hZ2UuY3NzKCBpbWFnZVN0eWxlICkuY3NzKCB0cmFuc2l0aW9uUHJvcDEgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVyb0NvcHkuY3NzKGNvcHlTdHlsZSkuY3NzKGNvcHlUcmFuc2l0aW9uUHJvcCkuY3NzKGNvcHlUcmFuc2l0aW9uRGVsYXlQcm9wKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlcm9Db3B5LmNzcyhyZXNldFN0eWxlKS5vbiggc2VsZi50cmFuc0VuZEV2ZW50TmFtZSwgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJnSW1hZ2UuY3NzKCByZXNldFN0eWxlICkub24oIHNlbGYudHJhbnNFbmRFdmVudE5hbWUsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNsaWNlLmNzcyggcmVzZXRTdHlsZSApLm9uKCBzZWxmLnRyYW5zRW5kRXZlbnROYW1lLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJChlLnRhcmdldCA9PT0gc2xpY2UpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuX29uRW5kTmF2aWdhdGUoIHNsaWNlLCAkY3VycmVudFNsaWRlLCBkaXIgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ICk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgNTAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL30pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2xpY2UgPSB0aGlzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZXJvQ29weSA9IHNsaWNlLmZpbmQoJy5oZXJvLWNvcHknKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmdJbWFnZSA9IHNsaWNlLmZpbmQoJy5iZy1pbWcnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNsaWNlLmNzcygnaGVpZ2h0JywgTWF0aC5yb3VuZChzbGljZS5wYXJlbnQoKS5oZWlnaHQoKSAqIDEuNTApLnRvU3RyaW5nKCkgKyAncHgnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNsaWNlLmNzcyggcmVzZXRTdHlsZSApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNzcyggdHJhbnNpdGlvblByb3AxICk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmdJbWFnZS5jc3MoIHJlc2V0U3R5bGUgKS5jc3MoIHRyYW5zaXRpb25Qcm9wMSApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZXJvQ29weS5jc3MocmVzZXRTdHlsZSkuY3NzKGNvcHlUcmFuc2l0aW9uUHJvcCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZXJvQ29weS5jc3MoY29weVN0eWxlKS5vbiggc2VsZi50cmFuc0VuZEV2ZW50TmFtZSwgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJnSW1hZ2UuY3NzKCBpbWFnZVN0eWxlICkub24oIHNlbGYudHJhbnNFbmRFdmVudE5hbWUsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNsaWNlLmNzcyggc2xpY2UxU3R5bGUgKS5vbiggc2VsZi50cmFuc0VuZEV2ZW50TmFtZSwgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuX29uRW5kTmF2aWdhdGUoIHNsaWNlLCAkY3VycmVudFNsaWRlLCBkaXIgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDUwICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICk7XG5cblxuXG4gICAgICAgICAgICAvKnNsaWNlMi5jb25kKFxuICAgICAgICAgICAgICAgIGRpciA9PT0gJ3ByZXYnLFxuXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzbGljZSA9IHRoaXM7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jc3MoIHNsaWNlMlN0eWxlICkuY3NzKCB0cmFuc2l0aW9uUHJvcDIgKS5jc3MoIHRyYW5zaXRpb25Qcm9wMkRlbGF5ICk7XG5cbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkY3VycmVudFNsaWRlLmFkZENsYXNzKCAnc2wtdHJhbnMtYmFjay1lbGVtcycgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWNlLmNzcyggcmVzZXRTdHlsZSApO1xuICAgICAgICAgICAgICAgICAgICB9LCA1MCApO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNsaWNlID0gdGhpcztcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNzcyggcmVzZXRTdHlsZSApLmNzcyggdHJhbnNpdGlvblByb3AyICk7XG4gICAgICAgICAgICAgICAgICAgIHNsaWNlLmZpbmQoJy5oZXJvLWNvcHknKS5jc3MoJ29wYWNpdHknLCAwKTtcblxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRuZXh0U2xpZGUuYWRkQ2xhc3MoICdzbC10cmFucy1lbGVtcycgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWNlLmNzcyggc2xpY2UyU3R5bGUgKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgNTAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApOyovXG5cbiAgICAgICAgICAgICRuZXh0U2xpZGUuc2hvdygpO1xuXG4gICAgICAgIH0sXG4gICAgICAgIF92YWxpZGF0ZVZhbHVlcyA6IGZ1bmN0aW9uKCBjb25maWcgKSB7XG5cbiAgICAgICAgICAgIC8vIE9LLCBzbyB3ZSBhcmUgcmVzdHJpY3RpbmcgdGhlIGFuZ2xlcyBhbmQgc2NhbGUgdmFsdWVzIGhlcmUuXG4gICAgICAgICAgICAvLyBUaGlzIGlzIHRvIGF2b2lkIHRoZSBzbGljZXMgd3Jvbmcgc2lkZXMgdG8gYmUgc2hvd24uXG4gICAgICAgICAgICAvLyB5b3UgY2FuIGFkanVzdCB0aGVzZSB2YWx1ZXMgYXMgeW91IHdpc2ggYnV0IG1ha2Ugc3VyZSB5b3UgYWxzbyBhanVzdCB0aGVcbiAgICAgICAgICAgIC8vIHBhZGRpbmdzIG9mIHRoZSBzbGlkZXMgYW5kIGFsc28gdGhlIG9wdGlvbnMudHJhbnNsYXRlRmFjdG9yIHZhbHVlIGFuZCBzY2FsZSBkYXRhIGF0dHJzXG4gICAgICAgICAgICBpZiggY29uZmlnLnNsaWNlMWFuZ2xlID4gdGhpcy5vcHRpb25zLm1heEFuZ2xlIHx8IGNvbmZpZy5zbGljZTFhbmdsZSA8IC10aGlzLm9wdGlvbnMubWF4QW5nbGUgKSB7XG5cbiAgICAgICAgICAgICAgICBjb25maWcuc2xpY2UxYW5nbGUgPSB0aGlzLm9wdGlvbnMubWF4QW5nbGU7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKCBjb25maWcuc2xpY2UyYW5nbGUgPiB0aGlzLm9wdGlvbnMubWF4QW5nbGUgIHx8IGNvbmZpZy5zbGljZTJhbmdsZSA8IC10aGlzLm9wdGlvbnMubWF4QW5nbGUgKSB7XG5cbiAgICAgICAgICAgICAgICBjb25maWcuc2xpY2UyYW5nbGUgPSB0aGlzLm9wdGlvbnMubWF4QW5nbGU7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKCBjb25maWcuc2xpY2Uxc2NhbGUgPiB0aGlzLm9wdGlvbnMubWF4U2NhbGUgfHwgY29uZmlnLnNsaWNlMXNjYWxlIDw9IDAgKSB7XG5cbiAgICAgICAgICAgICAgICBjb25maWcuc2xpY2Uxc2NhbGUgPSB0aGlzLm9wdGlvbnMubWF4U2NhbGU7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKCBjb25maWcuc2xpY2Uyc2NhbGUgPiB0aGlzLm9wdGlvbnMubWF4U2NhbGUgfHwgY29uZmlnLnNsaWNlMnNjYWxlIDw9IDAgKSB7XG5cbiAgICAgICAgICAgICAgICBjb25maWcuc2xpY2Uyc2NhbGUgPSB0aGlzLm9wdGlvbnMubWF4U2NhbGU7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKCBjb25maWcub3JpZW50YXRpb24gIT09ICd2ZXJ0aWNhbCcgJiYgY29uZmlnLm9yaWVudGF0aW9uICE9PSAnaG9yaXpvbnRhbCcgKSB7XG5cbiAgICAgICAgICAgICAgICBjb25maWcub3JpZW50YXRpb24gPSAnaG9yaXpvbnRhbCc7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9LFxuICAgICAgICBfb25FbmROYXZpZ2F0ZSA6IGZ1bmN0aW9uKCAkc2xpY2UsICRvbGRTbGlkZSwgZGlyICkge1xuXG4gICAgICAgICAgICAvLyByZXNldCBwcmV2aW91cyBzbGlkZSdzIHN0eWxlIGFmdGVyIG5leHQgc2xpZGUgaXMgc2hvd25cbiAgICAgICAgICAgIHZhciAkc2xpZGUgPSAkc2xpY2UucGFyZW50KCksXG4gICAgICAgICAgICAgICAgcmVtb3ZlQ2xhc3NlcyA9ICdzbC10cmFucy1lbGVtcyBzbC10cmFucy1iYWNrLWVsZW1zJyxcbiAgICAgICAgICAgICAgICByZXNldFN0eWxlID0ge1xuICAgICAgICAgICAgICAgICAgICAndHJhbnNmb3JtJyA6ICd0cmFuc2xhdGUoMCUsMCUpIHJvdGF0ZSgwZGVnKSBzY2FsZSgxKScsXG4gICAgICAgICAgICAgICAgICAgICdvcGFjaXR5JyA6IDFcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyByZW1vdmUgc2Vjb25kIHNsaWRlJ3Mgc2xpY2VcbiAgICAgICAgICAgIC8vJHNsaWNlLnJlbW92ZSgpO1xuICAgICAgICAgICAgLy8gdW53cmFwLi5cbiAgICAgICAgICAgICRzbGlkZS5jc3MoICd6LWluZGV4JywgMSApXG4gICAgICAgICAgICAgICAgICAuZmluZCggJ2Rpdi5zbC1jb250ZW50LXdyYXBwZXInIClcbiAgICAgICAgICAgICAgICAgIC51bndyYXAoKTtcblxuICAgICAgICAgICAgJHNsaWRlLmZpbmQoJy5iZy1pbWcnKS5jc3MoIHJlc2V0U3R5bGUgKTtcbiAgICAgICAgICAgICRzbGlkZS5maW5kKCcuaGVyby1jb3B5JykuY3NzKCdvcGFjaXR5JywgMSk7XG5cbiAgICAgICAgICAgIC8vIGhpZGUgcHJldmlvdXMgY3VycmVudCBzbGlkZVxuICAgICAgICAgICAgJG9sZFNsaWRlLmhpZGUoKS5yZW1vdmVDbGFzcyggcmVtb3ZlQ2xhc3NlcyApO1xuICAgICAgICAgICAgJHNsaWRlLnJlbW92ZUNsYXNzKCByZW1vdmVDbGFzc2VzICk7XG4gICAgICAgICAgICAvLyBub3cgd2UgY2FuIG5hdmlnYXRlIGFnYWluLi5cbiAgICAgICAgICAgIHRoaXMuaXNBbmltYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5vbkFmdGVyQ2hhbmdlKCAkc2xpZGUsIHRoaXMuY3VycmVudCApO1xuXG4gICAgICAgIH0sXG4gICAgICAgIF9zZXRTaXplIDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIC8vIHRoZSBzbGlkZXIgYW5kIGNvbnRlbnQgd3JhcHBlcnMgd2lsbCBoYXZlIHRoZSB3aW5kb3cncyB3aWR0aCBhbmQgaGVpZ2h0XG4gICAgICAgICAgICB2YXIgY3NzU3R5bGUgPSB7XG4gICAgICAgICAgICAgICAgd2lkdGggOiB0aGlzLnNpemUud2lkdGgsXG4gICAgICAgICAgICAgICAgaGVpZ2h0IDogdGhpcy5zaXplLmhlaWdodFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy4kZWwuY3NzKCBjc3NTdHlsZSApLmZpbmQoICdkaXYuc2wtY29udGVudC13cmFwcGVyJyApLmNzcyggY3NzU3R5bGUgKTtcblxuICAgICAgICB9LFxuICAgICAgICBfbG9hZEV2ZW50cyA6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgICR3aW5kb3cub24oICdkZWJvdW5jZWRyZXNpemUuc2xpdHNsaWRlcicsIGZ1bmN0aW9uKCBldmVudCApIHtcblxuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSBzaXplIHZhbHVlc1xuICAgICAgICAgICAgICAgIHNlbGYuX2dldFNpemUoKTtcbiAgICAgICAgICAgICAgICAvLyBzZXQgdGhlIHNpemVzIGFnYWluXG4gICAgICAgICAgICAgICAgc2VsZi5fc2V0U2l6ZSgpO1xuXG4gICAgICAgICAgICB9ICk7XG5cbiAgICAgICAgICAgIGlmICggdGhpcy5vcHRpb25zLmtleWJvYXJkICkge1xuXG4gICAgICAgICAgICAgICAgJGRvY3VtZW50Lm9uKCAna2V5ZG93bi5zbGl0c2xpZGVyJywgZnVuY3Rpb24oZSkge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBrZXlDb2RlID0gZS5rZXlDb2RlIHx8IGUud2hpY2gsXG4gICAgICAgICAgICAgICAgICAgICAgICBhcnJvdyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAzNyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cDogMzgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHQ6IDM5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvd246IDQwXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoa2V5Q29kZSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIGFycm93LmxlZnQgOlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5fc3RvcFNsaWRlc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuX25hdmlnYXRlKCAncHJldicgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBhcnJvdy5yaWdodCA6XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLl9zdG9wU2xpZGVzaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5fbmF2aWdhdGUoICduZXh0JyApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0gKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0sXG4gICAgICAgIF9zdGFydFNsaWRlc2hvdzogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgdGhpcy5zbGlkZXNob3cgPSBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgIHNlbGYuX25hdmlnYXRlKCAnbmV4dCcgKTtcblxuICAgICAgICAgICAgICAgIGlmICggc2VsZi5vcHRpb25zLmF1dG9wbGF5ICkge1xuXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX3N0YXJ0U2xpZGVzaG93KCk7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0sIHRoaXMub3B0aW9ucy5pbnRlcnZhbCApO1xuXG4gICAgICAgIH0sXG4gICAgICAgIF9zdG9wU2xpZGVzaG93OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgaWYgKCB0aGlzLm9wdGlvbnMuYXV0b3BsYXkgKSB7XG5cbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoIHRoaXMuc2xpZGVzaG93ICk7XG4gICAgICAgICAgICAgICAgdGhpcy5pc1BsYXlpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuYXV0b3BsYXkgPSBmYWxzZTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0sXG4gICAgICAgIF9kZXN0cm95IDogZnVuY3Rpb24oIGNhbGxiYWNrICkge1xuXG4gICAgICAgICAgICB0aGlzLiRlbC5vZmYoICcuc2xpdHNsaWRlcicgKS5yZW1vdmVEYXRhKCAnc2xpdHNsaWRlcicgKTtcbiAgICAgICAgICAgICR3aW5kb3cub2ZmKCAnLnNsaXRzbGlkZXInICk7XG4gICAgICAgICAgICAkZG9jdW1lbnQub2ZmKCAnLnNsaXRzbGlkZXInICk7XG4gICAgICAgICAgICB0aGlzLiRzbGlkZXMuZWFjaCggZnVuY3Rpb24oIGkgKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgJHNsaWRlID0gJCggdGhpcyApLFxuICAgICAgICAgICAgICAgICAgICAkY29udGVudCA9ICRzbGlkZS5maW5kKCAnZGl2LnNsLWNvbnRlbnQnICkuY2hpbGRyZW4oKTtcblxuICAgICAgICAgICAgICAgICRjb250ZW50LmFwcGVuZFRvKCAkc2xpZGUgKTtcbiAgICAgICAgICAgICAgICAkc2xpZGUuY2hpbGRyZW4oICdkaXYuc2wtY29udGVudC13cmFwcGVyJyApLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICB9ICk7XG4gICAgICAgICAgICB0aGlzLiRzbGlkZXMudW53cmFwKCB0aGlzLiRzbGlkZVdyYXBwZXIgKS5oaWRlKCk7XG4gICAgICAgICAgICB0aGlzLiRzbGlkZXMuZXEoIDAgKS5zaG93KCk7XG4gICAgICAgICAgICBpZiggY2FsbGJhY2sgKSB7XG5cbiAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9LFxuICAgICAgICAvLyBwdWJsaWMgbWV0aG9zOiBhZGRzIG1vcmUgc2xpZGVzIHRvIHRoZSBzbGlkZXJcbiAgICAgICAgYWRkIDogZnVuY3Rpb24oICRzbGlkZXMsIGNhbGxiYWNrICkge1xuXG4gICAgICAgICAgICB0aGlzLiRzbGlkZXMgPSB0aGlzLiRzbGlkZXMuYWRkKCAkc2xpZGVzICk7XG5cbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuXG4gICAgICAgICAgICAkc2xpZGVzLmVhY2goIGZ1bmN0aW9uKCBpICkge1xuXG4gICAgICAgICAgICAgICAgdmFyICRzbGlkZSA9ICQoIHRoaXMgKSxcbiAgICAgICAgICAgICAgICAgICAgLy8gdmVydGljYWwgfHwgaG9yaXpvbnRhbFxuICAgICAgICAgICAgICAgICAgICBvcmllbnRhdGlvbiA9ICRzbGlkZS5kYXRhKCAnb3JpZW50YXRpb24nICk7XG5cbiAgICAgICAgICAgICAgICAkc2xpZGUuaGlkZSgpLmFkZENsYXNzKCAnc2wtc2xpZGUtJyArIG9yaWVudGF0aW9uIClcbiAgICAgICAgICAgICAgICAgICAgICAuY2hpbGRyZW4oKVxuICAgICAgICAgICAgICAgICAgICAgIC53cmFwQWxsKCAnPGRpdiBjbGFzcz1cInNsLWNvbnRlbnQtd3JhcHBlclwiIC8+JyApXG4gICAgICAgICAgICAgICAgICAgICAgLndyYXBBbGwoICc8ZGl2IGNsYXNzPVwic2wtY29udGVudFwiIC8+JyApXG4gICAgICAgICAgICAgICAgICAgICAgLmVuZCgpXG4gICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZFRvKCBzZWxmLiRlbC5maW5kKCAnZGl2LnNsLXNsaWRlcy13cmFwcGVyJyApICk7XG5cbiAgICAgICAgICAgIH0gKTtcblxuICAgICAgICAgICAgdGhpcy5fc2V0U2l6ZSgpO1xuXG4gICAgICAgICAgICB0aGlzLnNsaWRlc0NvdW50ID0gdGhpcy4kc2xpZGVzLmxlbmd0aDtcblxuICAgICAgICAgICAgaWYgKCBjYWxsYmFjayApIHtcblxuICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoICRpdGVtcyApO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSxcbiAgICAgICAgLy8gcHVibGljIG1ldGhvZDogc2hvd3MgbmV4dCBzbGlkZVxuICAgICAgICBuZXh0IDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHRoaXMuX3N0b3BTbGlkZXNob3coKTtcbiAgICAgICAgICAgIHRoaXMuX25hdmlnYXRlKCAnbmV4dCcgKTtcblxuICAgICAgICB9LFxuICAgICAgICAvLyBwdWJsaWMgbWV0aG9kOiBzaG93cyBwcmV2aW91cyBzbGlkZVxuICAgICAgICBwcmV2aW91cyA6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB0aGlzLl9zdG9wU2xpZGVzaG93KCk7XG4gICAgICAgICAgICB0aGlzLl9uYXZpZ2F0ZSggJ3ByZXYnICk7XG5cbiAgICAgICAgfSxcbiAgICAgICAgLy8gcHVibGljIG1ldGhvZDogZ29lcyB0byBhIHNwZWNpZmljIHNsaWRlXG4gICAgICAgIGp1bXAgOiBmdW5jdGlvbiggcG9zICkge1xuXG4gICAgICAgICAgICBwb3MgLT0gMTtcblxuICAgICAgICAgICAgaWYoIHBvcyA9PT0gdGhpcy5jdXJyZW50IHx8IHBvcyA+PSB0aGlzLnNsaWRlc0NvdW50IHx8IHBvcyA8IDAgKSB7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fc3RvcFNsaWRlc2hvdygpO1xuICAgICAgICAgICAgdGhpcy5fbmF2aWdhdGUoIHBvcyA+IHRoaXMuY3VycmVudCA/ICduZXh0JyA6ICdwcmV2JywgcG9zICk7XG5cbiAgICAgICAgfSxcbiAgICAgICAgLy8gcHVibGljIG1ldGhvZDogc3RhcnRzIHRoZSBzbGlkZXNob3dcbiAgICAgICAgLy8gYW55IGNhbGwgdG8gbmV4dCgpLCBwcmV2aW91cygpIG9yIGp1bXAoKSB3aWxsIHN0b3AgdGhlIHNsaWRlc2hvd1xuICAgICAgICBwbGF5IDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIGlmKCAhdGhpcy5pc1BsYXlpbmcgKSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmlzUGxheWluZyA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9uYXZpZ2F0ZSggJ25leHQnICk7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmF1dG9wbGF5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGFydFNsaWRlc2hvdygpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSxcbiAgICAgICAgLy8gcHVibGljIG1ldGhvZDogcGF1c2VzIHRoZSBzbGlkZXNob3dcbiAgICAgICAgcGF1c2UgOiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgaWYoIHRoaXMuaXNQbGF5aW5nICkge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fc3RvcFNsaWRlc2hvdygpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSxcbiAgICAgICAgLy8gcHVibGljIG1ldGhvZDogY2hlY2sgaWYgaXNBbmltYXRpbmcgaXMgdHJ1ZVxuICAgICAgICBpc0FjdGl2ZSA6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pc0FuaW1hdGluZztcblxuICAgICAgICB9LFxuICAgICAgICAvLyBwdWJsaWNjIG1ldGhvczogZGVzdHJveXMgdGhlIHNsaWNlYm94IGluc3RhbmNlXG4gICAgICAgIGRlc3Ryb3kgOiBmdW5jdGlvbiggY2FsbGJhY2sgKSB7XG5cbiAgICAgICAgICAgIHRoaXMuX2Rlc3Ryb3koIGNhbGxiYWNrICk7XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIHZhciBsb2dFcnJvciA9IGZ1bmN0aW9uKCBtZXNzYWdlICkge1xuXG4gICAgICAgIGlmICggd2luZG93LmNvbnNvbGUgKSB7XG5cbiAgICAgICAgICAgIHdpbmRvdy5jb25zb2xlLmVycm9yKCBtZXNzYWdlICk7XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgICQuZm4uc2xpdHNsaWRlciA9IGZ1bmN0aW9uKCBvcHRpb25zICkge1xuXG4gICAgICAgIHZhciBzZWxmID0gJC5kYXRhKCB0aGlzLCAnc2xpdHNsaWRlcicgKTtcblxuICAgICAgICBpZiAoIHR5cGVvZiBvcHRpb25zID09PSAnc3RyaW5nJyApIHtcblxuICAgICAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzLCAxICk7XG5cbiAgICAgICAgICAgIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgIGlmICggIXNlbGYgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgbG9nRXJyb3IoIFwiY2Fubm90IGNhbGwgbWV0aG9kcyBvbiBzbGl0c2xpZGVyIHByaW9yIHRvIGluaXRpYWxpemF0aW9uOyBcIiArXG4gICAgICAgICAgICAgICAgICAgIFwiYXR0ZW1wdGVkIHRvIGNhbGwgbWV0aG9kICdcIiArIG9wdGlvbnMgKyBcIidcIiApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoICEkLmlzRnVuY3Rpb24oIHNlbGZbb3B0aW9uc10gKSB8fCBvcHRpb25zLmNoYXJBdCgwKSA9PT0gXCJfXCIgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgbG9nRXJyb3IoIFwibm8gc3VjaCBtZXRob2QgJ1wiICsgb3B0aW9ucyArIFwiJyBmb3Igc2xpdHNsaWRlciBzZWxmXCIgKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc2VsZlsgb3B0aW9ucyBdLmFwcGx5KCBzZWxmLCBhcmdzICk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG5cbiAgICAgICAgICAgIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgIGlmICggc2VsZiApIHtcblxuICAgICAgICAgICAgICAgICAgICBzZWxmLl9pbml0KCk7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgc2VsZiA9ICQuZGF0YSggdGhpcywgJ3NsaXRzbGlkZXInLCBuZXcgJC5TbGl0c2xpZGVyKCBvcHRpb25zLCB0aGlzICkgKTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZWxmO1xuXG4gICAgfTtcblxufSApKCBqUXVlcnksIHdpbmRvdyApOyJdLCJmaWxlIjoic2Nyb2xsLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
