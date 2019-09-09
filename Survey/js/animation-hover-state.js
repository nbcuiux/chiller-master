//Tilt effect
/**
 * tiltfx.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2015, Codrops
 * http://www.codrops.com
 */
//;(function(window) {

	//'use strict';

	/**
	 * **************************************************************************
	 * utils
	 * **************************************************************************
	 */

	// from https://gist.github.com/desandro/1866474
	var lastTime = 0;
	var prefixes = 'webkit moz ms o'.split(' ');
	// get unprefixed rAF and cAF, if present
	var requestAnimationFrame = window.requestAnimationFrame;
	var cancelAnimationFrame = window.cancelAnimationFrame;
	// loop through vendor prefixes and get prefixed rAF and cAF
	var prefix;
	for( var i = 0; i < prefixes.length; i++ ) {
		if ( requestAnimationFrame && cancelAnimationFrame ) {
			break;
		}
		prefix = prefixes[i];
		requestAnimationFrame = requestAnimationFrame || window[ prefix + 'RequestAnimationFrame' ];
		cancelAnimationFrame  = cancelAnimationFrame  || window[ prefix + 'CancelAnimationFrame' ] ||
		window[ prefix + 'CancelRequestAnimationFrame' ];
	}

	// fallback to setTimeout and clearTimeout if either request/cancel is not supported
	if ( !requestAnimationFrame || !cancelAnimationFrame ) {
		requestAnimationFrame = function( callback, element ) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) );
			var id = window.setTimeout( function() {
				callback( currTime + timeToCall );
			}, timeToCall );
			lastTime = currTime + timeToCall;
			return id;
		};

		cancelAnimationFrame = function( id ) {
			window.clearTimeout( id );
		};
	}

	function extend( a, b ) {
		for( var key in b ) {
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	}

	// from http://www.quirksmode.org/js/events_properties.html#position
	function getMousePos(e) {
		var posx = 0;
		var posy = 0;
		if (!e) e = window.event;
		if (e.pageX || e.pageY) 	{
			posx = e.pageX;
			posy = e.pageY;
		}
		else if (e.clientX || e.clientY) 	{
			posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		return {
			x : posx,
			y : posy
		};
	}

	// from http://www.sberry.me/articles/javascript-event-throttling-debouncing
	function throttle(fn, delay) {
		var allowSample = true;

		return function(e) {
			if (allowSample) {
				allowSample = false;
				setTimeout(function() { allowSample = true; }, delay);
				fn(e);
			}
		};
	}

	/***************************************************************************/

	/**
	 * TiltFx fn
	 */
	function TiltFx(el, options) {
		this.el = el;
		this.options = extend( {}, this.options );
		extend( this.options, options );
		this._init();
		this._initEvents();
	}

	/**
	 * TiltFx options.
	 */
	TiltFx.prototype.options = {
		// number of extra image elements (div with background-image) to add to the DOM - min:1, max:5 (for a higher number, it's recommended to remove the transitions of .tilt__front in the stylesheet.
		extraImgs : 2,
		// the opacity value for all the image elements.
		opacity : 0.7,
		// by default the first layer does not move.
		bgfixed : true,
		//Transition effect
		transition : false,
		// image element's movement configuration
		movement : {
			perspective : 1000, // perspective value
			translateX : -10, // a relative movement of -10px to 10px on the x-axis (setting a negative value reverses the direction)
			translateY : -10, // a relative movement of -10px to 10px on the y-axis
			translateZ : 20, // a relative movement of -20px to 20px on the z-axis (perspective value must be set). Also, this specific translation is done when the mouse moves vertically.
			rotateX : 2, // a relative rotation of -2deg to 2deg on the x-axis (perspective value must be set)
			rotateY : 2, // a relative rotation of -2deg to 2deg on the y-axis (perspective value must be set)
			rotateZ : 0 // z-axis rotation; by default there's no rotation on the z-axis (perspective value must be set)
		}
	};

	/**
	 * Initialize: build the necessary structure for the image elements and replace it with the HTML img element.
	 */
	TiltFx.prototype._init = function() {
		this.tiltWrapper = document.createElement('div');
		this.tiltWrapper.className = 'tilt';

		// main image element.
		this.tiltImgBack = document.createElement('div');
		this.tiltImgBack.className = 'tilt__back';
		this.tiltImgBack.style.backgroundImage = 'url(' + this.el.src + ')';
		this.tiltWrapper.appendChild(this.tiltImgBack);

		// image elements limit.
		if( this.options.extraImgs < 1 ) {
			this.options.extraImgs = 1;
		}
		else if( this.options.extraImgs > 5 ) {
			this.options.extraImgs = 5;
		}

		if( !this.options.movement.perspective ) {
			this.options.movement.perspective = 0;
		}
		// add the extra image elements.
		this.imgElems = [];
		for(var i = 0; i < this.options.extraImgs; ++i) {

			var el = document.createElement('div');
			el.className = 'tilt__front';
			el.style.backgroundImage = 'url(' + this.el.src + ')';
			el.style.opacity = this.options.opacity;
			el.style.transition = this.options.transition ? this.options.transition.toString() + 's ease-out' : '';
			this.tiltWrapper.appendChild(el);
			this.imgElems.push(el);
		}

		if( !this.options.bgfixed ) {
			this.imgElems.push(this.tiltImgBack);
			++this.options.extraImgs;
		}

		// add it to the DOM and remove original img element.
		this.el.parentNode.insertBefore(this.tiltWrapper, this.el);
		this.el.parentNode.removeChild(this.el);

		// tiltWrapper properties: width/height/left/top
		this.view = { width : this.tiltWrapper.offsetWidth, height : this.tiltWrapper.offsetHeight };
	};

	/**
	 * Initialize the events on the main wrapper.
	 */
	TiltFx.prototype._initEvents = function() {
		var self = this,
			moveOpts = self.options.movement;

		// mousemove event..
		this.tiltWrapper.addEventListener('mousemove', function(ev) {
			requestAnimationFrame(function() {
					// mouse position relative to the document.
				var mousepos = getMousePos(ev),
					// document scrolls.
					docScrolls = {left : document.body.scrollLeft + document.documentElement.scrollLeft, top : document.body.scrollTop + document.documentElement.scrollTop},
					bounds = self.tiltWrapper.getBoundingClientRect(),
					// mouse position relative to the main element (tiltWrapper).
					relmousepos = {
						x : mousepos.x - bounds.left - docScrolls.left,
						y : mousepos.y - bounds.top - docScrolls.top
					};

				// configure the movement for each image element.
				for(var i = 0, len = self.imgElems.length; i < len; ++i) {
					var el = self.imgElems[i],
						rotX = moveOpts.rotateX ? 2 * ((i+1)*moveOpts.rotateX/self.options.extraImgs) / self.view.height * relmousepos.y - ((i+1)*moveOpts.rotateX/self.options.extraImgs) : 0,
						rotY = moveOpts.rotateY ? 2 * ((i+1)*moveOpts.rotateY/self.options.extraImgs) / self.view.width * relmousepos.x - ((i+1)*moveOpts.rotateY/self.options.extraImgs) : 0,
						rotZ = moveOpts.rotateZ ? 2 * ((i+1)*moveOpts.rotateZ/self.options.extraImgs) / self.view.width * relmousepos.x - ((i+1)*moveOpts.rotateZ/self.options.extraImgs) : 0,
						transX = moveOpts.translateX ? 2 * ((i+1)*moveOpts.translateX/self.options.extraImgs) / self.view.width * relmousepos.x - ((i+1)*moveOpts.translateX/self.options.extraImgs) : 0,
						transY = moveOpts.translateY ? 2 * ((i+1)*moveOpts.translateY/self.options.extraImgs) / self.view.height * relmousepos.y - ((i+1)*moveOpts.translateY/self.options.extraImgs) : 0,
						transZ = moveOpts.translateZ ? 2 * ((i+1)*moveOpts.translateZ/self.options.extraImgs) / self.view.height * relmousepos.y - ((i+1)*moveOpts.translateZ/self.options.extraImgs) : 0;

					el.style.WebkitTransform = 'perspective(' + moveOpts.perspective + 'px) translate3d(' + transX + 'px,' + transY + 'px,' + transZ + 'px) rotate3d(1,0,0,' + rotX + 'deg) rotate3d(0,1,0,' + rotY + 'deg) rotate3d(0,0,1,' + rotZ + 'deg)';
					el.style.transform = 'perspective(' + moveOpts.perspective + 'px) translate3d(' + transX + 'px,' + transY + 'px,' + transZ + 'px) rotate3d(1,0,0,' + rotX + 'deg) rotate3d(0,1,0,' + rotY + 'deg) rotate3d(0,0,1,' + rotZ + 'deg)';
				}
			});
		});

		// reset all when mouse leaves the main wrapper.
		this.tiltWrapper.addEventListener('mouseleave', function(ev) {
			setTimeout(function() {
			for(var i = 0, len = self.imgElems.length; i < len; ++i) {
				var el = self.imgElems[i];
				el.style.WebkitTransform = 'perspective(' + moveOpts.perspective + 'px) translate3d(0,0,0) rotate3d(1,1,1,0deg)';
				el.style.transform = 'perspective(' + moveOpts.perspective + 'px) translate3d(0,0,0) rotate3d(1,1,1,0deg)';
			}
			}, 60);

		});

		// window resize
		window.addEventListener('resize', throttle(function(ev) {
			// recalculate tiltWrapper properties: width/height/left/top
			self.view = { width : self.tiltWrapper.offsetWidth, height : self.tiltWrapper.offsetHeight };
		}, 50));
	};

	function init() {
		// search for imgs with the class "tilt-effect"
		[].slice.call(document.querySelectorAll('img.tilt-effect')).forEach(function(img) {
			new TiltFx(img, JSON.parse(img.getAttribute('data-tilt-options')));
		});
	}

	init();
	window.TiltFx = TiltFx;


//})(window);

//Shiver Effect
/**
 * tiltfx.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2015, Codrops
 * http://www.codrops.com
 */
;(function(window) {

	'use strict';

	/**
	 * **************************************************************************
	 * utils
	 * **************************************************************************
	 */

	// from https://gist.github.com/desandro/1866474
	var lastTime = 0;
	var prefixes = 'webkit moz ms o'.split(' ');
	// get unprefixed rAF and cAF, if present
	var requestAnimationFrame = window.requestAnimationFrame;
	var cancelAnimationFrame = window.cancelAnimationFrame;
	// loop through vendor prefixes and get prefixed rAF and cAF
	var prefix;
	for( var i = 0; i < prefixes.length; i++ ) {
		if ( requestAnimationFrame && cancelAnimationFrame ) {
			break;
		}
		prefix = prefixes[i];
		requestAnimationFrame = requestAnimationFrame || window[ prefix + 'RequestAnimationFrame' ];
		cancelAnimationFrame  = cancelAnimationFrame  || window[ prefix + 'CancelAnimationFrame' ] ||
		window[ prefix + 'CancelRequestAnimationFrame' ];
	}

	// fallback to setTimeout and clearTimeout if either request/cancel is not supported
	if ( !requestAnimationFrame || !cancelAnimationFrame ) {
		requestAnimationFrame = function( callback, element ) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) );
			var id = window.setTimeout( function() {
				callback( currTime + timeToCall );
			}, timeToCall );
			lastTime = currTime + timeToCall;
			return id;
		};

		cancelAnimationFrame = function( id ) {
			window.clearTimeout( id );
		};
	}

	function extend( a, b ) {
		for( var key in b ) {
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	}

	// from http://www.quirksmode.org/js/events_properties.html#position
	function getMousePos(e) {
		var posx = 0;
		var posy = 0;
		if (!e) e = window.event;
		if (e.pageX || e.pageY) 	{
			posx = e.pageX;
			posy = e.pageY;
		}
		else if (e.clientX || e.clientY) 	{
			posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		return {
			x : posx,
			y : posy
		};
	}

	// from http://www.sberry.me/articles/javascript-event-throttling-debouncing
	function throttle(fn, delay) {
		var allowSample = true;

		return function(e) {
			if (allowSample) {
				allowSample = false;
				setTimeout(function() { allowSample = true; }, delay);
				fn(e);
			}
		};
	}

	/***************************************************************************/

	/**
	 * TiltFx fn
	 */
	function ShiverFx(el, options) {
		this.el = el;
		this.options = extend( {}, this.options );
		extend( this.options, options );
		this._init();
		this._initEvents();
	}

	/**
	 * TiltFx options.
	 */
	ShiverFx.prototype.options = {
		// number of extra image elements (div with background-image) to add to the DOM - min:1, max:5 (for a higher number, it's recommended to remove the transitions of .tilt__front in the stylesheet.
		extraImgs : 3,
		// the opacity value for all the image elements.
		opacity : 0.7,
		// by default the first layer does not move.
		bgfixed : true,
		//Speed of animation
		duration: 0.1, // number of animations in second
		// image element's movement configuration
		movement : {
			horizontal : true, // perspective value
			vertical : true, // a relative movement of -10px to 10px on the x-axis (setting a negative value reverses the direction)
			rotate : true // a relative movement of -10px to 10px on the y-axis
		}
	};

	/**
	 * Initialize: build the necessary structure for the image elements and replace it with the HTML img element.
	 */
	ShiverFx.prototype._init = function() {
		this.shiverWrapper = document.createElement('div');
		this.shiverWrapper.className = 'shiver';

		// main image element.
		this.shiverImgBack = document.createElement('div');
		this.shiverImgBack.className = 'shiver__back';
		this.shiverImgBack.style.backgroundImage = 'url(' + this.el.src + ')';
		this.shiverWrapper.appendChild(this.shiverImgBack);

		// add the extra image elements.
		var movements = this.options.movement;
		for(var key in movements) {
			var movement = movements[key];
			movement = movement < 0 ? 0: movement > 3 ? 3 : movement;

			var el = document.createElement('div');
			el.className = 'shiver__front shiver_animation';
			el.style.backgroundImage = 'url(' + this.el.src + ')';
			el.style.opacity = this.options.opacity;
			el.style.animationName = 'shiver_' + key.slice(0,1) + '_' + movement;
			el.style.animationDuration = this.options.duration.toString() + 's';
			this.shiverWrapper.appendChild(el);
			//this.imgElems.push(el);
		}

		// add it to the DOM and remove original img element.
		this.el.parentNode.insertBefore(this.shiverWrapper, this.el);
		this.el.parentNode.removeChild(this.el);

		// tiltWrapper properties: width/height/left/top
		this.view = { width : this.shiverWrapper.offsetWidth, height : this.shiverWrapper.offsetHeight };
	};

	/**
	 * Initialize the events on the main wrapper.
	 */
	ShiverFx.prototype._initEvents = function() {
		var self = this;

		// window resize
		window.addEventListener('resize', throttle(function(ev) {
			// recalculate tiltWrapper properties: width/height/left/top
			self.view = { width : self.shiverWrapper.offsetWidth, height : self.shiverWrapper.offsetHeight };
		}, 50));
	};

	function init() {
		// search for imgs with the class "tilt-effect"
		[].slice.call(document.querySelectorAll('img.shiver-effect')).forEach(function(img) {
			new ShiverFx(img, JSON.parse(img.getAttribute('data-shiver-options')));
		});
	}

	init();

	window.ShiverFx = ShiverFx;

})(window);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhbmltYXRpb24taG92ZXItc3RhdGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy9UaWx0IGVmZmVjdFxuLyoqXG4gKiB0aWx0ZnguanNcbiAqIGh0dHA6Ly93d3cuY29kcm9wcy5jb21cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICpcbiAqIENvcHlyaWdodCAyMDE1LCBDb2Ryb3BzXG4gKiBodHRwOi8vd3d3LmNvZHJvcHMuY29tXG4gKi9cbi8vOyhmdW5jdGlvbih3aW5kb3cpIHtcblxuXHQvLyd1c2Ugc3RyaWN0JztcblxuXHQvKipcblx0ICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblx0ICogdXRpbHNcblx0ICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblx0ICovXG5cblx0Ly8gZnJvbSBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9kZXNhbmRyby8xODY2NDc0XG5cdHZhciBsYXN0VGltZSA9IDA7XG5cdHZhciBwcmVmaXhlcyA9ICd3ZWJraXQgbW96IG1zIG8nLnNwbGl0KCcgJyk7XG5cdC8vIGdldCB1bnByZWZpeGVkIHJBRiBhbmQgY0FGLCBpZiBwcmVzZW50XG5cdHZhciByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xuXHR2YXIgY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWU7XG5cdC8vIGxvb3AgdGhyb3VnaCB2ZW5kb3IgcHJlZml4ZXMgYW5kIGdldCBwcmVmaXhlZCByQUYgYW5kIGNBRlxuXHR2YXIgcHJlZml4O1xuXHRmb3IoIHZhciBpID0gMDsgaSA8IHByZWZpeGVzLmxlbmd0aDsgaSsrICkge1xuXHRcdGlmICggcmVxdWVzdEFuaW1hdGlvbkZyYW1lICYmIGNhbmNlbEFuaW1hdGlvbkZyYW1lICkge1xuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHRcdHByZWZpeCA9IHByZWZpeGVzW2ldO1xuXHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB3aW5kb3dbIHByZWZpeCArICdSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnIF07XG5cdFx0Y2FuY2VsQW5pbWF0aW9uRnJhbWUgID0gY2FuY2VsQW5pbWF0aW9uRnJhbWUgIHx8IHdpbmRvd1sgcHJlZml4ICsgJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJyBdIHx8XG5cdFx0d2luZG93WyBwcmVmaXggKyAnQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lJyBdO1xuXHR9XG5cblx0Ly8gZmFsbGJhY2sgdG8gc2V0VGltZW91dCBhbmQgY2xlYXJUaW1lb3V0IGlmIGVpdGhlciByZXF1ZXN0L2NhbmNlbCBpcyBub3Qgc3VwcG9ydGVkXG5cdGlmICggIXJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCAhY2FuY2VsQW5pbWF0aW9uRnJhbWUgKSB7XG5cdFx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24oIGNhbGxiYWNrLCBlbGVtZW50ICkge1xuXHRcdFx0dmFyIGN1cnJUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cdFx0XHR2YXIgdGltZVRvQ2FsbCA9IE1hdGgubWF4KCAwLCAxNiAtICggY3VyclRpbWUgLSBsYXN0VGltZSApICk7XG5cdFx0XHR2YXIgaWQgPSB3aW5kb3cuc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNhbGxiYWNrKCBjdXJyVGltZSArIHRpbWVUb0NhbGwgKTtcblx0XHRcdH0sIHRpbWVUb0NhbGwgKTtcblx0XHRcdGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsO1xuXHRcdFx0cmV0dXJuIGlkO1xuXHRcdH07XG5cblx0XHRjYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uKCBpZCApIHtcblx0XHRcdHdpbmRvdy5jbGVhclRpbWVvdXQoIGlkICk7XG5cdFx0fTtcblx0fVxuXG5cdGZ1bmN0aW9uIGV4dGVuZCggYSwgYiApIHtcblx0XHRmb3IoIHZhciBrZXkgaW4gYiApIHtcblx0XHRcdGlmKCBiLmhhc093blByb3BlcnR5KCBrZXkgKSApIHtcblx0XHRcdFx0YVtrZXldID0gYltrZXldO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gYTtcblx0fVxuXG5cdC8vIGZyb20gaHR0cDovL3d3dy5xdWlya3Ntb2RlLm9yZy9qcy9ldmVudHNfcHJvcGVydGllcy5odG1sI3Bvc2l0aW9uXG5cdGZ1bmN0aW9uIGdldE1vdXNlUG9zKGUpIHtcblx0XHR2YXIgcG9zeCA9IDA7XG5cdFx0dmFyIHBvc3kgPSAwO1xuXHRcdGlmICghZSkgZSA9IHdpbmRvdy5ldmVudDtcblx0XHRpZiAoZS5wYWdlWCB8fCBlLnBhZ2VZKSBcdHtcblx0XHRcdHBvc3ggPSBlLnBhZ2VYO1xuXHRcdFx0cG9zeSA9IGUucGFnZVk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKGUuY2xpZW50WCB8fCBlLmNsaWVudFkpIFx0e1xuXHRcdFx0cG9zeCA9IGUuY2xpZW50WCArIGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCArIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0O1xuXHRcdFx0cG9zeSA9IGUuY2xpZW50WSArIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wICsgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDtcblx0XHR9XG5cdFx0cmV0dXJuIHtcblx0XHRcdHggOiBwb3N4LFxuXHRcdFx0eSA6IHBvc3lcblx0XHR9O1xuXHR9XG5cblx0Ly8gZnJvbSBodHRwOi8vd3d3LnNiZXJyeS5tZS9hcnRpY2xlcy9qYXZhc2NyaXB0LWV2ZW50LXRocm90dGxpbmctZGVib3VuY2luZ1xuXHRmdW5jdGlvbiB0aHJvdHRsZShmbiwgZGVsYXkpIHtcblx0XHR2YXIgYWxsb3dTYW1wbGUgPSB0cnVlO1xuXG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGUpIHtcblx0XHRcdGlmIChhbGxvd1NhbXBsZSkge1xuXHRcdFx0XHRhbGxvd1NhbXBsZSA9IGZhbHNlO1xuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBhbGxvd1NhbXBsZSA9IHRydWU7IH0sIGRlbGF5KTtcblx0XHRcdFx0Zm4oZSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fVxuXG5cdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblx0LyoqXG5cdCAqIFRpbHRGeCBmblxuXHQgKi9cblx0ZnVuY3Rpb24gVGlsdEZ4KGVsLCBvcHRpb25zKSB7XG5cdFx0dGhpcy5lbCA9IGVsO1xuXHRcdHRoaXMub3B0aW9ucyA9IGV4dGVuZCgge30sIHRoaXMub3B0aW9ucyApO1xuXHRcdGV4dGVuZCggdGhpcy5vcHRpb25zLCBvcHRpb25zICk7XG5cdFx0dGhpcy5faW5pdCgpO1xuXHRcdHRoaXMuX2luaXRFdmVudHMoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaWx0Rnggb3B0aW9ucy5cblx0ICovXG5cdFRpbHRGeC5wcm90b3R5cGUub3B0aW9ucyA9IHtcblx0XHQvLyBudW1iZXIgb2YgZXh0cmEgaW1hZ2UgZWxlbWVudHMgKGRpdiB3aXRoIGJhY2tncm91bmQtaW1hZ2UpIHRvIGFkZCB0byB0aGUgRE9NIC0gbWluOjEsIG1heDo1IChmb3IgYSBoaWdoZXIgbnVtYmVyLCBpdCdzIHJlY29tbWVuZGVkIHRvIHJlbW92ZSB0aGUgdHJhbnNpdGlvbnMgb2YgLnRpbHRfX2Zyb250IGluIHRoZSBzdHlsZXNoZWV0LlxuXHRcdGV4dHJhSW1ncyA6IDIsXG5cdFx0Ly8gdGhlIG9wYWNpdHkgdmFsdWUgZm9yIGFsbCB0aGUgaW1hZ2UgZWxlbWVudHMuXG5cdFx0b3BhY2l0eSA6IDAuNyxcblx0XHQvLyBieSBkZWZhdWx0IHRoZSBmaXJzdCBsYXllciBkb2VzIG5vdCBtb3ZlLlxuXHRcdGJnZml4ZWQgOiB0cnVlLFxuXHRcdC8vVHJhbnNpdGlvbiBlZmZlY3Rcblx0XHR0cmFuc2l0aW9uIDogZmFsc2UsXG5cdFx0Ly8gaW1hZ2UgZWxlbWVudCdzIG1vdmVtZW50IGNvbmZpZ3VyYXRpb25cblx0XHRtb3ZlbWVudCA6IHtcblx0XHRcdHBlcnNwZWN0aXZlIDogMTAwMCwgLy8gcGVyc3BlY3RpdmUgdmFsdWVcblx0XHRcdHRyYW5zbGF0ZVggOiAtMTAsIC8vIGEgcmVsYXRpdmUgbW92ZW1lbnQgb2YgLTEwcHggdG8gMTBweCBvbiB0aGUgeC1heGlzIChzZXR0aW5nIGEgbmVnYXRpdmUgdmFsdWUgcmV2ZXJzZXMgdGhlIGRpcmVjdGlvbilcblx0XHRcdHRyYW5zbGF0ZVkgOiAtMTAsIC8vIGEgcmVsYXRpdmUgbW92ZW1lbnQgb2YgLTEwcHggdG8gMTBweCBvbiB0aGUgeS1heGlzXG5cdFx0XHR0cmFuc2xhdGVaIDogMjAsIC8vIGEgcmVsYXRpdmUgbW92ZW1lbnQgb2YgLTIwcHggdG8gMjBweCBvbiB0aGUgei1heGlzIChwZXJzcGVjdGl2ZSB2YWx1ZSBtdXN0IGJlIHNldCkuIEFsc28sIHRoaXMgc3BlY2lmaWMgdHJhbnNsYXRpb24gaXMgZG9uZSB3aGVuIHRoZSBtb3VzZSBtb3ZlcyB2ZXJ0aWNhbGx5LlxuXHRcdFx0cm90YXRlWCA6IDIsIC8vIGEgcmVsYXRpdmUgcm90YXRpb24gb2YgLTJkZWcgdG8gMmRlZyBvbiB0aGUgeC1heGlzIChwZXJzcGVjdGl2ZSB2YWx1ZSBtdXN0IGJlIHNldClcblx0XHRcdHJvdGF0ZVkgOiAyLCAvLyBhIHJlbGF0aXZlIHJvdGF0aW9uIG9mIC0yZGVnIHRvIDJkZWcgb24gdGhlIHktYXhpcyAocGVyc3BlY3RpdmUgdmFsdWUgbXVzdCBiZSBzZXQpXG5cdFx0XHRyb3RhdGVaIDogMCAvLyB6LWF4aXMgcm90YXRpb247IGJ5IGRlZmF1bHQgdGhlcmUncyBubyByb3RhdGlvbiBvbiB0aGUgei1heGlzIChwZXJzcGVjdGl2ZSB2YWx1ZSBtdXN0IGJlIHNldClcblx0XHR9XG5cdH07XG5cblx0LyoqXG5cdCAqIEluaXRpYWxpemU6IGJ1aWxkIHRoZSBuZWNlc3Nhcnkgc3RydWN0dXJlIGZvciB0aGUgaW1hZ2UgZWxlbWVudHMgYW5kIHJlcGxhY2UgaXQgd2l0aCB0aGUgSFRNTCBpbWcgZWxlbWVudC5cblx0ICovXG5cdFRpbHRGeC5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnRpbHRXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0dGhpcy50aWx0V3JhcHBlci5jbGFzc05hbWUgPSAndGlsdCc7XG5cblx0XHQvLyBtYWluIGltYWdlIGVsZW1lbnQuXG5cdFx0dGhpcy50aWx0SW1nQmFjayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdHRoaXMudGlsdEltZ0JhY2suY2xhc3NOYW1lID0gJ3RpbHRfX2JhY2snO1xuXHRcdHRoaXMudGlsdEltZ0JhY2suc3R5bGUuYmFja2dyb3VuZEltYWdlID0gJ3VybCgnICsgdGhpcy5lbC5zcmMgKyAnKSc7XG5cdFx0dGhpcy50aWx0V3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLnRpbHRJbWdCYWNrKTtcblxuXHRcdC8vIGltYWdlIGVsZW1lbnRzIGxpbWl0LlxuXHRcdGlmKCB0aGlzLm9wdGlvbnMuZXh0cmFJbWdzIDwgMSApIHtcblx0XHRcdHRoaXMub3B0aW9ucy5leHRyYUltZ3MgPSAxO1xuXHRcdH1cblx0XHRlbHNlIGlmKCB0aGlzLm9wdGlvbnMuZXh0cmFJbWdzID4gNSApIHtcblx0XHRcdHRoaXMub3B0aW9ucy5leHRyYUltZ3MgPSA1O1xuXHRcdH1cblxuXHRcdGlmKCAhdGhpcy5vcHRpb25zLm1vdmVtZW50LnBlcnNwZWN0aXZlICkge1xuXHRcdFx0dGhpcy5vcHRpb25zLm1vdmVtZW50LnBlcnNwZWN0aXZlID0gMDtcblx0XHR9XG5cdFx0Ly8gYWRkIHRoZSBleHRyYSBpbWFnZSBlbGVtZW50cy5cblx0XHR0aGlzLmltZ0VsZW1zID0gW107XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMub3B0aW9ucy5leHRyYUltZ3M7ICsraSkge1xuXG5cdFx0XHR2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdGVsLmNsYXNzTmFtZSA9ICd0aWx0X19mcm9udCc7XG5cdFx0XHRlbC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSAndXJsKCcgKyB0aGlzLmVsLnNyYyArICcpJztcblx0XHRcdGVsLnN0eWxlLm9wYWNpdHkgPSB0aGlzLm9wdGlvbnMub3BhY2l0eTtcblx0XHRcdGVsLnN0eWxlLnRyYW5zaXRpb24gPSB0aGlzLm9wdGlvbnMudHJhbnNpdGlvbiA/IHRoaXMub3B0aW9ucy50cmFuc2l0aW9uLnRvU3RyaW5nKCkgKyAncyBlYXNlLW91dCcgOiAnJztcblx0XHRcdHRoaXMudGlsdFdyYXBwZXIuYXBwZW5kQ2hpbGQoZWwpO1xuXHRcdFx0dGhpcy5pbWdFbGVtcy5wdXNoKGVsKTtcblx0XHR9XG5cblx0XHRpZiggIXRoaXMub3B0aW9ucy5iZ2ZpeGVkICkge1xuXHRcdFx0dGhpcy5pbWdFbGVtcy5wdXNoKHRoaXMudGlsdEltZ0JhY2spO1xuXHRcdFx0Kyt0aGlzLm9wdGlvbnMuZXh0cmFJbWdzO1xuXHRcdH1cblxuXHRcdC8vIGFkZCBpdCB0byB0aGUgRE9NIGFuZCByZW1vdmUgb3JpZ2luYWwgaW1nIGVsZW1lbnQuXG5cdFx0dGhpcy5lbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0aGlzLnRpbHRXcmFwcGVyLCB0aGlzLmVsKTtcblx0XHR0aGlzLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5lbCk7XG5cblx0XHQvLyB0aWx0V3JhcHBlciBwcm9wZXJ0aWVzOiB3aWR0aC9oZWlnaHQvbGVmdC90b3Bcblx0XHR0aGlzLnZpZXcgPSB7IHdpZHRoIDogdGhpcy50aWx0V3JhcHBlci5vZmZzZXRXaWR0aCwgaGVpZ2h0IDogdGhpcy50aWx0V3JhcHBlci5vZmZzZXRIZWlnaHQgfTtcblx0fTtcblxuXHQvKipcblx0ICogSW5pdGlhbGl6ZSB0aGUgZXZlbnRzIG9uIHRoZSBtYWluIHdyYXBwZXIuXG5cdCAqL1xuXHRUaWx0RngucHJvdG90eXBlLl9pbml0RXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzLFxuXHRcdFx0bW92ZU9wdHMgPSBzZWxmLm9wdGlvbnMubW92ZW1lbnQ7XG5cblx0XHQvLyBtb3VzZW1vdmUgZXZlbnQuLlxuXHRcdHRoaXMudGlsdFdyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgZnVuY3Rpb24oZXYpIHtcblx0XHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQvLyBtb3VzZSBwb3NpdGlvbiByZWxhdGl2ZSB0byB0aGUgZG9jdW1lbnQuXG5cdFx0XHRcdHZhciBtb3VzZXBvcyA9IGdldE1vdXNlUG9zKGV2KSxcblx0XHRcdFx0XHQvLyBkb2N1bWVudCBzY3JvbGxzLlxuXHRcdFx0XHRcdGRvY1Njcm9sbHMgPSB7bGVmdCA6IGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCArIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0LCB0b3AgOiBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCArIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3B9LFxuXHRcdFx0XHRcdGJvdW5kcyA9IHNlbGYudGlsdFdyYXBwZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG5cdFx0XHRcdFx0Ly8gbW91c2UgcG9zaXRpb24gcmVsYXRpdmUgdG8gdGhlIG1haW4gZWxlbWVudCAodGlsdFdyYXBwZXIpLlxuXHRcdFx0XHRcdHJlbG1vdXNlcG9zID0ge1xuXHRcdFx0XHRcdFx0eCA6IG1vdXNlcG9zLnggLSBib3VuZHMubGVmdCAtIGRvY1Njcm9sbHMubGVmdCxcblx0XHRcdFx0XHRcdHkgOiBtb3VzZXBvcy55IC0gYm91bmRzLnRvcCAtIGRvY1Njcm9sbHMudG9wXG5cdFx0XHRcdFx0fTtcblxuXHRcdFx0XHQvLyBjb25maWd1cmUgdGhlIG1vdmVtZW50IGZvciBlYWNoIGltYWdlIGVsZW1lbnQuXG5cdFx0XHRcdGZvcih2YXIgaSA9IDAsIGxlbiA9IHNlbGYuaW1nRWxlbXMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcblx0XHRcdFx0XHR2YXIgZWwgPSBzZWxmLmltZ0VsZW1zW2ldLFxuXHRcdFx0XHRcdFx0cm90WCA9IG1vdmVPcHRzLnJvdGF0ZVggPyAyICogKChpKzEpKm1vdmVPcHRzLnJvdGF0ZVgvc2VsZi5vcHRpb25zLmV4dHJhSW1ncykgLyBzZWxmLnZpZXcuaGVpZ2h0ICogcmVsbW91c2Vwb3MueSAtICgoaSsxKSptb3ZlT3B0cy5yb3RhdGVYL3NlbGYub3B0aW9ucy5leHRyYUltZ3MpIDogMCxcblx0XHRcdFx0XHRcdHJvdFkgPSBtb3ZlT3B0cy5yb3RhdGVZID8gMiAqICgoaSsxKSptb3ZlT3B0cy5yb3RhdGVZL3NlbGYub3B0aW9ucy5leHRyYUltZ3MpIC8gc2VsZi52aWV3LndpZHRoICogcmVsbW91c2Vwb3MueCAtICgoaSsxKSptb3ZlT3B0cy5yb3RhdGVZL3NlbGYub3B0aW9ucy5leHRyYUltZ3MpIDogMCxcblx0XHRcdFx0XHRcdHJvdFogPSBtb3ZlT3B0cy5yb3RhdGVaID8gMiAqICgoaSsxKSptb3ZlT3B0cy5yb3RhdGVaL3NlbGYub3B0aW9ucy5leHRyYUltZ3MpIC8gc2VsZi52aWV3LndpZHRoICogcmVsbW91c2Vwb3MueCAtICgoaSsxKSptb3ZlT3B0cy5yb3RhdGVaL3NlbGYub3B0aW9ucy5leHRyYUltZ3MpIDogMCxcblx0XHRcdFx0XHRcdHRyYW5zWCA9IG1vdmVPcHRzLnRyYW5zbGF0ZVggPyAyICogKChpKzEpKm1vdmVPcHRzLnRyYW5zbGF0ZVgvc2VsZi5vcHRpb25zLmV4dHJhSW1ncykgLyBzZWxmLnZpZXcud2lkdGggKiByZWxtb3VzZXBvcy54IC0gKChpKzEpKm1vdmVPcHRzLnRyYW5zbGF0ZVgvc2VsZi5vcHRpb25zLmV4dHJhSW1ncykgOiAwLFxuXHRcdFx0XHRcdFx0dHJhbnNZID0gbW92ZU9wdHMudHJhbnNsYXRlWSA/IDIgKiAoKGkrMSkqbW92ZU9wdHMudHJhbnNsYXRlWS9zZWxmLm9wdGlvbnMuZXh0cmFJbWdzKSAvIHNlbGYudmlldy5oZWlnaHQgKiByZWxtb3VzZXBvcy55IC0gKChpKzEpKm1vdmVPcHRzLnRyYW5zbGF0ZVkvc2VsZi5vcHRpb25zLmV4dHJhSW1ncykgOiAwLFxuXHRcdFx0XHRcdFx0dHJhbnNaID0gbW92ZU9wdHMudHJhbnNsYXRlWiA/IDIgKiAoKGkrMSkqbW92ZU9wdHMudHJhbnNsYXRlWi9zZWxmLm9wdGlvbnMuZXh0cmFJbWdzKSAvIHNlbGYudmlldy5oZWlnaHQgKiByZWxtb3VzZXBvcy55IC0gKChpKzEpKm1vdmVPcHRzLnRyYW5zbGF0ZVovc2VsZi5vcHRpb25zLmV4dHJhSW1ncykgOiAwO1xuXG5cdFx0XHRcdFx0ZWwuc3R5bGUuV2Via2l0VHJhbnNmb3JtID0gJ3BlcnNwZWN0aXZlKCcgKyBtb3ZlT3B0cy5wZXJzcGVjdGl2ZSArICdweCkgdHJhbnNsYXRlM2QoJyArIHRyYW5zWCArICdweCwnICsgdHJhbnNZICsgJ3B4LCcgKyB0cmFuc1ogKyAncHgpIHJvdGF0ZTNkKDEsMCwwLCcgKyByb3RYICsgJ2RlZykgcm90YXRlM2QoMCwxLDAsJyArIHJvdFkgKyAnZGVnKSByb3RhdGUzZCgwLDAsMSwnICsgcm90WiArICdkZWcpJztcblx0XHRcdFx0XHRlbC5zdHlsZS50cmFuc2Zvcm0gPSAncGVyc3BlY3RpdmUoJyArIG1vdmVPcHRzLnBlcnNwZWN0aXZlICsgJ3B4KSB0cmFuc2xhdGUzZCgnICsgdHJhbnNYICsgJ3B4LCcgKyB0cmFuc1kgKyAncHgsJyArIHRyYW5zWiArICdweCkgcm90YXRlM2QoMSwwLDAsJyArIHJvdFggKyAnZGVnKSByb3RhdGUzZCgwLDEsMCwnICsgcm90WSArICdkZWcpIHJvdGF0ZTNkKDAsMCwxLCcgKyByb3RaICsgJ2RlZyknO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdC8vIHJlc2V0IGFsbCB3aGVuIG1vdXNlIGxlYXZlcyB0aGUgbWFpbiB3cmFwcGVyLlxuXHRcdHRoaXMudGlsdFdyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0Zm9yKHZhciBpID0gMCwgbGVuID0gc2VsZi5pbWdFbGVtcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuXHRcdFx0XHR2YXIgZWwgPSBzZWxmLmltZ0VsZW1zW2ldO1xuXHRcdFx0XHRlbC5zdHlsZS5XZWJraXRUcmFuc2Zvcm0gPSAncGVyc3BlY3RpdmUoJyArIG1vdmVPcHRzLnBlcnNwZWN0aXZlICsgJ3B4KSB0cmFuc2xhdGUzZCgwLDAsMCkgcm90YXRlM2QoMSwxLDEsMGRlZyknO1xuXHRcdFx0XHRlbC5zdHlsZS50cmFuc2Zvcm0gPSAncGVyc3BlY3RpdmUoJyArIG1vdmVPcHRzLnBlcnNwZWN0aXZlICsgJ3B4KSB0cmFuc2xhdGUzZCgwLDAsMCkgcm90YXRlM2QoMSwxLDEsMGRlZyknO1xuXHRcdFx0fVxuXHRcdFx0fSwgNjApO1xuXG5cdFx0fSk7XG5cblx0XHQvLyB3aW5kb3cgcmVzaXplXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRocm90dGxlKGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHQvLyByZWNhbGN1bGF0ZSB0aWx0V3JhcHBlciBwcm9wZXJ0aWVzOiB3aWR0aC9oZWlnaHQvbGVmdC90b3Bcblx0XHRcdHNlbGYudmlldyA9IHsgd2lkdGggOiBzZWxmLnRpbHRXcmFwcGVyLm9mZnNldFdpZHRoLCBoZWlnaHQgOiBzZWxmLnRpbHRXcmFwcGVyLm9mZnNldEhlaWdodCB9O1xuXHRcdH0sIDUwKSk7XG5cdH07XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHQvLyBzZWFyY2ggZm9yIGltZ3Mgd2l0aCB0aGUgY2xhc3MgXCJ0aWx0LWVmZmVjdFwiXG5cdFx0W10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbWcudGlsdC1lZmZlY3QnKSkuZm9yRWFjaChmdW5jdGlvbihpbWcpIHtcblx0XHRcdG5ldyBUaWx0RngoaW1nLCBKU09OLnBhcnNlKGltZy5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGlsdC1vcHRpb25zJykpKTtcblx0XHR9KTtcblx0fVxuXG5cdGluaXQoKTtcblx0d2luZG93LlRpbHRGeCA9IFRpbHRGeDtcblxuXG4vL30pKHdpbmRvdyk7XG5cbi8vU2hpdmVyIEVmZmVjdFxuLyoqXG4gKiB0aWx0ZnguanNcbiAqIGh0dHA6Ly93d3cuY29kcm9wcy5jb21cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICpcbiAqIENvcHlyaWdodCAyMDE1LCBDb2Ryb3BzXG4gKiBodHRwOi8vd3d3LmNvZHJvcHMuY29tXG4gKi9cbjsoZnVuY3Rpb24od2luZG93KSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8qKlxuXHQgKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXHQgKiB1dGlsc1xuXHQgKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXHQgKi9cblxuXHQvLyBmcm9tIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL2Rlc2FuZHJvLzE4NjY0NzRcblx0dmFyIGxhc3RUaW1lID0gMDtcblx0dmFyIHByZWZpeGVzID0gJ3dlYmtpdCBtb3ogbXMgbycuc3BsaXQoJyAnKTtcblx0Ly8gZ2V0IHVucHJlZml4ZWQgckFGIGFuZCBjQUYsIGlmIHByZXNlbnRcblx0dmFyIHJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG5cdHZhciBjYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZTtcblx0Ly8gbG9vcCB0aHJvdWdoIHZlbmRvciBwcmVmaXhlcyBhbmQgZ2V0IHByZWZpeGVkIHJBRiBhbmQgY0FGXG5cdHZhciBwcmVmaXg7XG5cdGZvciggdmFyIGkgPSAwOyBpIDwgcHJlZml4ZXMubGVuZ3RoOyBpKysgKSB7XG5cdFx0aWYgKCByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgJiYgY2FuY2VsQW5pbWF0aW9uRnJhbWUgKSB7XG5cdFx0XHRicmVhaztcblx0XHR9XG5cdFx0cHJlZml4ID0gcHJlZml4ZXNbaV07XG5cdFx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHdpbmRvd1sgcHJlZml4ICsgJ1JlcXVlc3RBbmltYXRpb25GcmFtZScgXTtcblx0XHRjYW5jZWxBbmltYXRpb25GcmFtZSAgPSBjYW5jZWxBbmltYXRpb25GcmFtZSAgfHwgd2luZG93WyBwcmVmaXggKyAnQ2FuY2VsQW5pbWF0aW9uRnJhbWUnIF0gfHxcblx0XHR3aW5kb3dbIHByZWZpeCArICdDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnIF07XG5cdH1cblxuXHQvLyBmYWxsYmFjayB0byBzZXRUaW1lb3V0IGFuZCBjbGVhclRpbWVvdXQgaWYgZWl0aGVyIHJlcXVlc3QvY2FuY2VsIGlzIG5vdCBzdXBwb3J0ZWRcblx0aWYgKCAhcmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8ICFjYW5jZWxBbmltYXRpb25GcmFtZSApIHtcblx0XHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbiggY2FsbGJhY2ssIGVsZW1lbnQgKSB7XG5cdFx0XHR2YXIgY3VyclRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblx0XHRcdHZhciB0aW1lVG9DYWxsID0gTWF0aC5tYXgoIDAsIDE2IC0gKCBjdXJyVGltZSAtIGxhc3RUaW1lICkgKTtcblx0XHRcdHZhciBpZCA9IHdpbmRvdy5zZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y2FsbGJhY2soIGN1cnJUaW1lICsgdGltZVRvQ2FsbCApO1xuXHRcdFx0fSwgdGltZVRvQ2FsbCApO1xuXHRcdFx0bGFzdFRpbWUgPSBjdXJyVGltZSArIHRpbWVUb0NhbGw7XG5cdFx0XHRyZXR1cm4gaWQ7XG5cdFx0fTtcblxuXHRcdGNhbmNlbEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24oIGlkICkge1xuXHRcdFx0d2luZG93LmNsZWFyVGltZW91dCggaWQgKTtcblx0XHR9O1xuXHR9XG5cblx0ZnVuY3Rpb24gZXh0ZW5kKCBhLCBiICkge1xuXHRcdGZvciggdmFyIGtleSBpbiBiICkge1xuXHRcdFx0aWYoIGIuaGFzT3duUHJvcGVydHkoIGtleSApICkge1xuXHRcdFx0XHRhW2tleV0gPSBiW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBhO1xuXHR9XG5cblx0Ly8gZnJvbSBodHRwOi8vd3d3LnF1aXJrc21vZGUub3JnL2pzL2V2ZW50c19wcm9wZXJ0aWVzLmh0bWwjcG9zaXRpb25cblx0ZnVuY3Rpb24gZ2V0TW91c2VQb3MoZSkge1xuXHRcdHZhciBwb3N4ID0gMDtcblx0XHR2YXIgcG9zeSA9IDA7XG5cdFx0aWYgKCFlKSBlID0gd2luZG93LmV2ZW50O1xuXHRcdGlmIChlLnBhZ2VYIHx8IGUucGFnZVkpIFx0e1xuXHRcdFx0cG9zeCA9IGUucGFnZVg7XG5cdFx0XHRwb3N5ID0gZS5wYWdlWTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoZS5jbGllbnRYIHx8IGUuY2xpZW50WSkgXHR7XG5cdFx0XHRwb3N4ID0gZS5jbGllbnRYICsgZG9jdW1lbnQuYm9keS5zY3JvbGxMZWZ0ICsgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQ7XG5cdFx0XHRwb3N5ID0gZS5jbGllbnRZICsgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgKyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wO1xuXHRcdH1cblx0XHRyZXR1cm4ge1xuXHRcdFx0eCA6IHBvc3gsXG5cdFx0XHR5IDogcG9zeVxuXHRcdH07XG5cdH1cblxuXHQvLyBmcm9tIGh0dHA6Ly93d3cuc2JlcnJ5Lm1lL2FydGljbGVzL2phdmFzY3JpcHQtZXZlbnQtdGhyb3R0bGluZy1kZWJvdW5jaW5nXG5cdGZ1bmN0aW9uIHRocm90dGxlKGZuLCBkZWxheSkge1xuXHRcdHZhciBhbGxvd1NhbXBsZSA9IHRydWU7XG5cblx0XHRyZXR1cm4gZnVuY3Rpb24oZSkge1xuXHRcdFx0aWYgKGFsbG93U2FtcGxlKSB7XG5cdFx0XHRcdGFsbG93U2FtcGxlID0gZmFsc2U7XG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IGFsbG93U2FtcGxlID0gdHJ1ZTsgfSwgZGVsYXkpO1xuXHRcdFx0XHRmbihlKTtcblx0XHRcdH1cblx0XHR9O1xuXHR9XG5cblx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXHQvKipcblx0ICogVGlsdEZ4IGZuXG5cdCAqL1xuXHRmdW5jdGlvbiBTaGl2ZXJGeChlbCwgb3B0aW9ucykge1xuXHRcdHRoaXMuZWwgPSBlbDtcblx0XHR0aGlzLm9wdGlvbnMgPSBleHRlbmQoIHt9LCB0aGlzLm9wdGlvbnMgKTtcblx0XHRleHRlbmQoIHRoaXMub3B0aW9ucywgb3B0aW9ucyApO1xuXHRcdHRoaXMuX2luaXQoKTtcblx0XHR0aGlzLl9pbml0RXZlbnRzKCk7XG5cdH1cblxuXHQvKipcblx0ICogVGlsdEZ4IG9wdGlvbnMuXG5cdCAqL1xuXHRTaGl2ZXJGeC5wcm90b3R5cGUub3B0aW9ucyA9IHtcblx0XHQvLyBudW1iZXIgb2YgZXh0cmEgaW1hZ2UgZWxlbWVudHMgKGRpdiB3aXRoIGJhY2tncm91bmQtaW1hZ2UpIHRvIGFkZCB0byB0aGUgRE9NIC0gbWluOjEsIG1heDo1IChmb3IgYSBoaWdoZXIgbnVtYmVyLCBpdCdzIHJlY29tbWVuZGVkIHRvIHJlbW92ZSB0aGUgdHJhbnNpdGlvbnMgb2YgLnRpbHRfX2Zyb250IGluIHRoZSBzdHlsZXNoZWV0LlxuXHRcdGV4dHJhSW1ncyA6IDMsXG5cdFx0Ly8gdGhlIG9wYWNpdHkgdmFsdWUgZm9yIGFsbCB0aGUgaW1hZ2UgZWxlbWVudHMuXG5cdFx0b3BhY2l0eSA6IDAuNyxcblx0XHQvLyBieSBkZWZhdWx0IHRoZSBmaXJzdCBsYXllciBkb2VzIG5vdCBtb3ZlLlxuXHRcdGJnZml4ZWQgOiB0cnVlLFxuXHRcdC8vU3BlZWQgb2YgYW5pbWF0aW9uXG5cdFx0ZHVyYXRpb246IDAuMSwgLy8gbnVtYmVyIG9mIGFuaW1hdGlvbnMgaW4gc2Vjb25kXG5cdFx0Ly8gaW1hZ2UgZWxlbWVudCdzIG1vdmVtZW50IGNvbmZpZ3VyYXRpb25cblx0XHRtb3ZlbWVudCA6IHtcblx0XHRcdGhvcml6b250YWwgOiB0cnVlLCAvLyBwZXJzcGVjdGl2ZSB2YWx1ZVxuXHRcdFx0dmVydGljYWwgOiB0cnVlLCAvLyBhIHJlbGF0aXZlIG1vdmVtZW50IG9mIC0xMHB4IHRvIDEwcHggb24gdGhlIHgtYXhpcyAoc2V0dGluZyBhIG5lZ2F0aXZlIHZhbHVlIHJldmVyc2VzIHRoZSBkaXJlY3Rpb24pXG5cdFx0XHRyb3RhdGUgOiB0cnVlIC8vIGEgcmVsYXRpdmUgbW92ZW1lbnQgb2YgLTEwcHggdG8gMTBweCBvbiB0aGUgeS1heGlzXG5cdFx0fVxuXHR9O1xuXG5cdC8qKlxuXHQgKiBJbml0aWFsaXplOiBidWlsZCB0aGUgbmVjZXNzYXJ5IHN0cnVjdHVyZSBmb3IgdGhlIGltYWdlIGVsZW1lbnRzIGFuZCByZXBsYWNlIGl0IHdpdGggdGhlIEhUTUwgaW1nIGVsZW1lbnQuXG5cdCAqL1xuXHRTaGl2ZXJGeC5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnNoaXZlcldyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHR0aGlzLnNoaXZlcldyYXBwZXIuY2xhc3NOYW1lID0gJ3NoaXZlcic7XG5cblx0XHQvLyBtYWluIGltYWdlIGVsZW1lbnQuXG5cdFx0dGhpcy5zaGl2ZXJJbWdCYWNrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0dGhpcy5zaGl2ZXJJbWdCYWNrLmNsYXNzTmFtZSA9ICdzaGl2ZXJfX2JhY2snO1xuXHRcdHRoaXMuc2hpdmVySW1nQmFjay5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSAndXJsKCcgKyB0aGlzLmVsLnNyYyArICcpJztcblx0XHR0aGlzLnNoaXZlcldyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5zaGl2ZXJJbWdCYWNrKTtcblxuXHRcdC8vIGFkZCB0aGUgZXh0cmEgaW1hZ2UgZWxlbWVudHMuXG5cdFx0dmFyIG1vdmVtZW50cyA9IHRoaXMub3B0aW9ucy5tb3ZlbWVudDtcblx0XHRmb3IodmFyIGtleSBpbiBtb3ZlbWVudHMpIHtcblx0XHRcdHZhciBtb3ZlbWVudCA9IG1vdmVtZW50c1trZXldO1xuXHRcdFx0bW92ZW1lbnQgPSBtb3ZlbWVudCA8IDAgPyAwOiBtb3ZlbWVudCA+IDMgPyAzIDogbW92ZW1lbnQ7XG5cblx0XHRcdHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0ZWwuY2xhc3NOYW1lID0gJ3NoaXZlcl9fZnJvbnQgc2hpdmVyX2FuaW1hdGlvbic7XG5cdFx0XHRlbC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSAndXJsKCcgKyB0aGlzLmVsLnNyYyArICcpJztcblx0XHRcdGVsLnN0eWxlLm9wYWNpdHkgPSB0aGlzLm9wdGlvbnMub3BhY2l0eTtcblx0XHRcdGVsLnN0eWxlLmFuaW1hdGlvbk5hbWUgPSAnc2hpdmVyXycgKyBrZXkuc2xpY2UoMCwxKSArICdfJyArIG1vdmVtZW50O1xuXHRcdFx0ZWwuc3R5bGUuYW5pbWF0aW9uRHVyYXRpb24gPSB0aGlzLm9wdGlvbnMuZHVyYXRpb24udG9TdHJpbmcoKSArICdzJztcblx0XHRcdHRoaXMuc2hpdmVyV3JhcHBlci5hcHBlbmRDaGlsZChlbCk7XG5cdFx0XHQvL3RoaXMuaW1nRWxlbXMucHVzaChlbCk7XG5cdFx0fVxuXG5cdFx0Ly8gYWRkIGl0IHRvIHRoZSBET00gYW5kIHJlbW92ZSBvcmlnaW5hbCBpbWcgZWxlbWVudC5cblx0XHR0aGlzLmVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRoaXMuc2hpdmVyV3JhcHBlciwgdGhpcy5lbCk7XG5cdFx0dGhpcy5lbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuZWwpO1xuXG5cdFx0Ly8gdGlsdFdyYXBwZXIgcHJvcGVydGllczogd2lkdGgvaGVpZ2h0L2xlZnQvdG9wXG5cdFx0dGhpcy52aWV3ID0geyB3aWR0aCA6IHRoaXMuc2hpdmVyV3JhcHBlci5vZmZzZXRXaWR0aCwgaGVpZ2h0IDogdGhpcy5zaGl2ZXJXcmFwcGVyLm9mZnNldEhlaWdodCB9O1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBJbml0aWFsaXplIHRoZSBldmVudHMgb24gdGhlIG1haW4gd3JhcHBlci5cblx0ICovXG5cdFNoaXZlckZ4LnByb3RvdHlwZS5faW5pdEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBzZWxmID0gdGhpcztcblxuXHRcdC8vIHdpbmRvdyByZXNpemVcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhyb3R0bGUoZnVuY3Rpb24oZXYpIHtcblx0XHRcdC8vIHJlY2FsY3VsYXRlIHRpbHRXcmFwcGVyIHByb3BlcnRpZXM6IHdpZHRoL2hlaWdodC9sZWZ0L3RvcFxuXHRcdFx0c2VsZi52aWV3ID0geyB3aWR0aCA6IHNlbGYuc2hpdmVyV3JhcHBlci5vZmZzZXRXaWR0aCwgaGVpZ2h0IDogc2VsZi5zaGl2ZXJXcmFwcGVyLm9mZnNldEhlaWdodCB9O1xuXHRcdH0sIDUwKSk7XG5cdH07XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHQvLyBzZWFyY2ggZm9yIGltZ3Mgd2l0aCB0aGUgY2xhc3MgXCJ0aWx0LWVmZmVjdFwiXG5cdFx0W10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbWcuc2hpdmVyLWVmZmVjdCcpKS5mb3JFYWNoKGZ1bmN0aW9uKGltZykge1xuXHRcdFx0bmV3IFNoaXZlckZ4KGltZywgSlNPTi5wYXJzZShpbWcuZ2V0QXR0cmlidXRlKCdkYXRhLXNoaXZlci1vcHRpb25zJykpKTtcblx0XHR9KTtcblx0fVxuXG5cdGluaXQoKTtcblxuXHR3aW5kb3cuU2hpdmVyRnggPSBTaGl2ZXJGeDtcblxufSkod2luZG93KTsiXSwiZmlsZSI6ImFuaW1hdGlvbi1ob3Zlci1zdGF0ZS5qcyJ9
