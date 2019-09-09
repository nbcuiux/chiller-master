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
