
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
			//console.log(el.style.transition);
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
			moveOpts = self.options.movement,
			eventTarget = self.options.target ? document.getElementById(self.options.target) : this.tiltWrapper;

		// mousemove event..
		eventTarget.addEventListener('mousemove', function(ev) {
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
		eventTarget.addEventListener('mouseleave', function(ev) {
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


})(window);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ0aWx0ZnguanMiXSwic291cmNlc0NvbnRlbnQiOlsiXG47KGZ1bmN0aW9uKHdpbmRvdykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHQvKipcblx0ICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblx0ICogdXRpbHNcblx0ICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblx0ICovXG5cblx0Ly8gZnJvbSBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9kZXNhbmRyby8xODY2NDc0XG5cdHZhciBsYXN0VGltZSA9IDA7XG5cdHZhciBwcmVmaXhlcyA9ICd3ZWJraXQgbW96IG1zIG8nLnNwbGl0KCcgJyk7XG5cdC8vIGdldCB1bnByZWZpeGVkIHJBRiBhbmQgY0FGLCBpZiBwcmVzZW50XG5cdHZhciByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xuXHR2YXIgY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWU7XG5cdC8vIGxvb3AgdGhyb3VnaCB2ZW5kb3IgcHJlZml4ZXMgYW5kIGdldCBwcmVmaXhlZCByQUYgYW5kIGNBRlxuXHR2YXIgcHJlZml4O1xuXHRmb3IoIHZhciBpID0gMDsgaSA8IHByZWZpeGVzLmxlbmd0aDsgaSsrICkge1xuXHRcdGlmICggcmVxdWVzdEFuaW1hdGlvbkZyYW1lICYmIGNhbmNlbEFuaW1hdGlvbkZyYW1lICkge1xuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHRcdHByZWZpeCA9IHByZWZpeGVzW2ldO1xuXHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB3aW5kb3dbIHByZWZpeCArICdSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnIF07XG5cdFx0Y2FuY2VsQW5pbWF0aW9uRnJhbWUgID0gY2FuY2VsQW5pbWF0aW9uRnJhbWUgIHx8IHdpbmRvd1sgcHJlZml4ICsgJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJyBdIHx8XG5cdFx0d2luZG93WyBwcmVmaXggKyAnQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lJyBdO1xuXHR9XG5cblx0Ly8gZmFsbGJhY2sgdG8gc2V0VGltZW91dCBhbmQgY2xlYXJUaW1lb3V0IGlmIGVpdGhlciByZXF1ZXN0L2NhbmNlbCBpcyBub3Qgc3VwcG9ydGVkXG5cdGlmICggIXJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCAhY2FuY2VsQW5pbWF0aW9uRnJhbWUgKSB7XG5cdFx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24oIGNhbGxiYWNrLCBlbGVtZW50ICkge1xuXHRcdFx0dmFyIGN1cnJUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cdFx0XHR2YXIgdGltZVRvQ2FsbCA9IE1hdGgubWF4KCAwLCAxNiAtICggY3VyclRpbWUgLSBsYXN0VGltZSApICk7XG5cdFx0XHR2YXIgaWQgPSB3aW5kb3cuc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNhbGxiYWNrKCBjdXJyVGltZSArIHRpbWVUb0NhbGwgKTtcblx0XHRcdH0sIHRpbWVUb0NhbGwgKTtcblx0XHRcdGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsO1xuXHRcdFx0cmV0dXJuIGlkO1xuXHRcdH07XG5cblx0XHRjYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uKCBpZCApIHtcblx0XHRcdHdpbmRvdy5jbGVhclRpbWVvdXQoIGlkICk7XG5cdFx0fTtcblx0fVxuXG5cdGZ1bmN0aW9uIGV4dGVuZCggYSwgYiApIHtcblx0XHRmb3IoIHZhciBrZXkgaW4gYiApIHtcblx0XHRcdGlmKCBiLmhhc093blByb3BlcnR5KCBrZXkgKSApIHtcblx0XHRcdFx0YVtrZXldID0gYltrZXldO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gYTtcblx0fVxuXG5cdC8vIGZyb20gaHR0cDovL3d3dy5xdWlya3Ntb2RlLm9yZy9qcy9ldmVudHNfcHJvcGVydGllcy5odG1sI3Bvc2l0aW9uXG5cdGZ1bmN0aW9uIGdldE1vdXNlUG9zKGUpIHtcblx0XHR2YXIgcG9zeCA9IDA7XG5cdFx0dmFyIHBvc3kgPSAwO1xuXHRcdGlmICghZSkgZSA9IHdpbmRvdy5ldmVudDtcblx0XHRpZiAoZS5wYWdlWCB8fCBlLnBhZ2VZKSBcdHtcblx0XHRcdHBvc3ggPSBlLnBhZ2VYO1xuXHRcdFx0cG9zeSA9IGUucGFnZVk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKGUuY2xpZW50WCB8fCBlLmNsaWVudFkpIFx0e1xuXHRcdFx0cG9zeCA9IGUuY2xpZW50WCArIGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCArIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0O1xuXHRcdFx0cG9zeSA9IGUuY2xpZW50WSArIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wICsgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDtcblx0XHR9XG5cdFx0cmV0dXJuIHtcblx0XHRcdHggOiBwb3N4LFxuXHRcdFx0eSA6IHBvc3lcblx0XHR9O1xuXHR9XG5cblx0Ly8gZnJvbSBodHRwOi8vd3d3LnNiZXJyeS5tZS9hcnRpY2xlcy9qYXZhc2NyaXB0LWV2ZW50LXRocm90dGxpbmctZGVib3VuY2luZ1xuXHRmdW5jdGlvbiB0aHJvdHRsZShmbiwgZGVsYXkpIHtcblx0XHR2YXIgYWxsb3dTYW1wbGUgPSB0cnVlO1xuXG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGUpIHtcblx0XHRcdGlmIChhbGxvd1NhbXBsZSkge1xuXHRcdFx0XHRhbGxvd1NhbXBsZSA9IGZhbHNlO1xuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBhbGxvd1NhbXBsZSA9IHRydWU7IH0sIGRlbGF5KTtcblx0XHRcdFx0Zm4oZSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fVxuXG5cdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblx0LyoqXG5cdCAqIFRpbHRGeCBmblxuXHQgKi9cblx0ZnVuY3Rpb24gVGlsdEZ4KGVsLCBvcHRpb25zKSB7XG5cdFx0dGhpcy5lbCA9IGVsO1xuXHRcdHRoaXMub3B0aW9ucyA9IGV4dGVuZCgge30sIHRoaXMub3B0aW9ucyApO1xuXHRcdGV4dGVuZCggdGhpcy5vcHRpb25zLCBvcHRpb25zICk7XG5cdFx0dGhpcy5faW5pdCgpO1xuXHRcdHRoaXMuX2luaXRFdmVudHMoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaWx0Rnggb3B0aW9ucy5cblx0ICovXG5cdFRpbHRGeC5wcm90b3R5cGUub3B0aW9ucyA9IHtcblx0XHQvLyBudW1iZXIgb2YgZXh0cmEgaW1hZ2UgZWxlbWVudHMgKGRpdiB3aXRoIGJhY2tncm91bmQtaW1hZ2UpIHRvIGFkZCB0byB0aGUgRE9NIC0gbWluOjEsIG1heDo1IChmb3IgYSBoaWdoZXIgbnVtYmVyLCBpdCdzIHJlY29tbWVuZGVkIHRvIHJlbW92ZSB0aGUgdHJhbnNpdGlvbnMgb2YgLnRpbHRfX2Zyb250IGluIHRoZSBzdHlsZXNoZWV0LlxuXHRcdGV4dHJhSW1ncyA6IDIsXG5cdFx0Ly8gdGhlIG9wYWNpdHkgdmFsdWUgZm9yIGFsbCB0aGUgaW1hZ2UgZWxlbWVudHMuXG5cdFx0b3BhY2l0eSA6IDAuNyxcblx0XHQvLyBieSBkZWZhdWx0IHRoZSBmaXJzdCBsYXllciBkb2VzIG5vdCBtb3ZlLlxuXHRcdGJnZml4ZWQgOiB0cnVlLFxuXHRcdC8vVHJhbnNpdGlvbiBlZmZlY3Rcblx0XHR0cmFuc2l0aW9uIDogZmFsc2UsXG5cdFx0Ly8gaW1hZ2UgZWxlbWVudCdzIG1vdmVtZW50IGNvbmZpZ3VyYXRpb25cblx0XHRtb3ZlbWVudCA6IHtcblx0XHRcdHBlcnNwZWN0aXZlIDogMTAwMCwgLy8gcGVyc3BlY3RpdmUgdmFsdWVcblx0XHRcdHRyYW5zbGF0ZVggOiAtMTAsIC8vIGEgcmVsYXRpdmUgbW92ZW1lbnQgb2YgLTEwcHggdG8gMTBweCBvbiB0aGUgeC1heGlzIChzZXR0aW5nIGEgbmVnYXRpdmUgdmFsdWUgcmV2ZXJzZXMgdGhlIGRpcmVjdGlvbilcblx0XHRcdHRyYW5zbGF0ZVkgOiAtMTAsIC8vIGEgcmVsYXRpdmUgbW92ZW1lbnQgb2YgLTEwcHggdG8gMTBweCBvbiB0aGUgeS1heGlzXG5cdFx0XHR0cmFuc2xhdGVaIDogMjAsIC8vIGEgcmVsYXRpdmUgbW92ZW1lbnQgb2YgLTIwcHggdG8gMjBweCBvbiB0aGUgei1heGlzIChwZXJzcGVjdGl2ZSB2YWx1ZSBtdXN0IGJlIHNldCkuIEFsc28sIHRoaXMgc3BlY2lmaWMgdHJhbnNsYXRpb24gaXMgZG9uZSB3aGVuIHRoZSBtb3VzZSBtb3ZlcyB2ZXJ0aWNhbGx5LlxuXHRcdFx0cm90YXRlWCA6IDIsIC8vIGEgcmVsYXRpdmUgcm90YXRpb24gb2YgLTJkZWcgdG8gMmRlZyBvbiB0aGUgeC1heGlzIChwZXJzcGVjdGl2ZSB2YWx1ZSBtdXN0IGJlIHNldClcblx0XHRcdHJvdGF0ZVkgOiAyLCAvLyBhIHJlbGF0aXZlIHJvdGF0aW9uIG9mIC0yZGVnIHRvIDJkZWcgb24gdGhlIHktYXhpcyAocGVyc3BlY3RpdmUgdmFsdWUgbXVzdCBiZSBzZXQpXG5cdFx0XHRyb3RhdGVaIDogMCAvLyB6LWF4aXMgcm90YXRpb247IGJ5IGRlZmF1bHQgdGhlcmUncyBubyByb3RhdGlvbiBvbiB0aGUgei1heGlzIChwZXJzcGVjdGl2ZSB2YWx1ZSBtdXN0IGJlIHNldClcblx0XHR9XG5cdH07XG5cblx0LyoqXG5cdCAqIEluaXRpYWxpemU6IGJ1aWxkIHRoZSBuZWNlc3Nhcnkgc3RydWN0dXJlIGZvciB0aGUgaW1hZ2UgZWxlbWVudHMgYW5kIHJlcGxhY2UgaXQgd2l0aCB0aGUgSFRNTCBpbWcgZWxlbWVudC5cblx0ICovXG5cdFRpbHRGeC5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnRpbHRXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0dGhpcy50aWx0V3JhcHBlci5jbGFzc05hbWUgPSAndGlsdCc7XG5cblx0XHQvLyBtYWluIGltYWdlIGVsZW1lbnQuXG5cdFx0dGhpcy50aWx0SW1nQmFjayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdHRoaXMudGlsdEltZ0JhY2suY2xhc3NOYW1lID0gJ3RpbHRfX2JhY2snO1xuXHRcdHRoaXMudGlsdEltZ0JhY2suc3R5bGUuYmFja2dyb3VuZEltYWdlID0gJ3VybCgnICsgdGhpcy5lbC5zcmMgKyAnKSc7XG5cdFx0dGhpcy50aWx0V3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLnRpbHRJbWdCYWNrKTtcblxuXHRcdC8vIGltYWdlIGVsZW1lbnRzIGxpbWl0LlxuXHRcdGlmKCB0aGlzLm9wdGlvbnMuZXh0cmFJbWdzIDwgMSApIHtcblx0XHRcdHRoaXMub3B0aW9ucy5leHRyYUltZ3MgPSAxO1xuXHRcdH1cblx0XHRlbHNlIGlmKCB0aGlzLm9wdGlvbnMuZXh0cmFJbWdzID4gNSApIHtcblx0XHRcdHRoaXMub3B0aW9ucy5leHRyYUltZ3MgPSA1O1xuXHRcdH1cblxuXHRcdGlmKCAhdGhpcy5vcHRpb25zLm1vdmVtZW50LnBlcnNwZWN0aXZlICkge1xuXHRcdFx0dGhpcy5vcHRpb25zLm1vdmVtZW50LnBlcnNwZWN0aXZlID0gMDtcblx0XHR9XG5cblx0XHQvLyBhZGQgdGhlIGV4dHJhIGltYWdlIGVsZW1lbnRzLlxuXHRcdHRoaXMuaW1nRWxlbXMgPSBbXTtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5vcHRpb25zLmV4dHJhSW1nczsgKytpKSB7XG5cdFx0XHR2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdGVsLmNsYXNzTmFtZSA9ICd0aWx0X19mcm9udCc7XG5cdFx0XHRlbC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSAndXJsKCcgKyB0aGlzLmVsLnNyYyArICcpJztcblx0XHRcdGVsLnN0eWxlLm9wYWNpdHkgPSB0aGlzLm9wdGlvbnMub3BhY2l0eTtcblx0XHRcdGVsLnN0eWxlLnRyYW5zaXRpb24gPSB0aGlzLm9wdGlvbnMudHJhbnNpdGlvbiA/IHRoaXMub3B0aW9ucy50cmFuc2l0aW9uLnRvU3RyaW5nKCkgKyAncyBlYXNlLW91dCcgOiAnJztcblx0XHRcdC8vY29uc29sZS5sb2coZWwuc3R5bGUudHJhbnNpdGlvbik7XG5cdFx0XHR0aGlzLnRpbHRXcmFwcGVyLmFwcGVuZENoaWxkKGVsKTtcblx0XHRcdHRoaXMuaW1nRWxlbXMucHVzaChlbCk7XG5cdFx0fVxuXG5cdFx0aWYoICF0aGlzLm9wdGlvbnMuYmdmaXhlZCApIHtcblx0XHRcdHRoaXMuaW1nRWxlbXMucHVzaCh0aGlzLnRpbHRJbWdCYWNrKTtcblx0XHRcdCsrdGhpcy5vcHRpb25zLmV4dHJhSW1ncztcblx0XHR9XG5cblx0XHQvLyBhZGQgaXQgdG8gdGhlIERPTSBhbmQgcmVtb3ZlIG9yaWdpbmFsIGltZyBlbGVtZW50LlxuXHRcdHRoaXMuZWwucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcy50aWx0V3JhcHBlciwgdGhpcy5lbCk7XG5cdFx0dGhpcy5lbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuZWwpO1xuXG5cdFx0Ly8gdGlsdFdyYXBwZXIgcHJvcGVydGllczogd2lkdGgvaGVpZ2h0L2xlZnQvdG9wXG5cdFx0dGhpcy52aWV3ID0geyB3aWR0aCA6IHRoaXMudGlsdFdyYXBwZXIub2Zmc2V0V2lkdGgsIGhlaWdodCA6IHRoaXMudGlsdFdyYXBwZXIub2Zmc2V0SGVpZ2h0IH07XG5cdH07XG5cblx0LyoqXG5cdCAqIEluaXRpYWxpemUgdGhlIGV2ZW50cyBvbiB0aGUgbWFpbiB3cmFwcGVyLlxuXHQgKi9cblx0VGlsdEZ4LnByb3RvdHlwZS5faW5pdEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBzZWxmID0gdGhpcyxcblx0XHRcdG1vdmVPcHRzID0gc2VsZi5vcHRpb25zLm1vdmVtZW50O1xuXG5cdFx0Ly8gbW91c2Vtb3ZlIGV2ZW50Li5cblx0XHR0aGlzLnRpbHRXcmFwcGVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Ly8gbW91c2UgcG9zaXRpb24gcmVsYXRpdmUgdG8gdGhlIGRvY3VtZW50LlxuXHRcdFx0XHR2YXIgbW91c2Vwb3MgPSBnZXRNb3VzZVBvcyhldiksXG5cdFx0XHRcdFx0Ly8gZG9jdW1lbnQgc2Nyb2xscy5cblx0XHRcdFx0XHRkb2NTY3JvbGxzID0ge2xlZnQgOiBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQgKyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdCwgdG9wIDogZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgKyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wfSxcblx0XHRcdFx0XHRib3VuZHMgPSBzZWxmLnRpbHRXcmFwcGVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuXHRcdFx0XHRcdC8vIG1vdXNlIHBvc2l0aW9uIHJlbGF0aXZlIHRvIHRoZSBtYWluIGVsZW1lbnQgKHRpbHRXcmFwcGVyKS5cblx0XHRcdFx0XHRyZWxtb3VzZXBvcyA9IHtcblx0XHRcdFx0XHRcdHggOiBtb3VzZXBvcy54IC0gYm91bmRzLmxlZnQgLSBkb2NTY3JvbGxzLmxlZnQsXG5cdFx0XHRcdFx0XHR5IDogbW91c2Vwb3MueSAtIGJvdW5kcy50b3AgLSBkb2NTY3JvbGxzLnRvcFxuXHRcdFx0XHRcdH07XG5cblx0XHRcdFx0Ly8gY29uZmlndXJlIHRoZSBtb3ZlbWVudCBmb3IgZWFjaCBpbWFnZSBlbGVtZW50LlxuXHRcdFx0XHRmb3IodmFyIGkgPSAwLCBsZW4gPSBzZWxmLmltZ0VsZW1zLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG5cdFx0XHRcdFx0dmFyIGVsID0gc2VsZi5pbWdFbGVtc1tpXSxcblx0XHRcdFx0XHRcdHJvdFggPSBtb3ZlT3B0cy5yb3RhdGVYID8gMiAqICgoaSsxKSptb3ZlT3B0cy5yb3RhdGVYL3NlbGYub3B0aW9ucy5leHRyYUltZ3MpIC8gc2VsZi52aWV3LmhlaWdodCAqIHJlbG1vdXNlcG9zLnkgLSAoKGkrMSkqbW92ZU9wdHMucm90YXRlWC9zZWxmLm9wdGlvbnMuZXh0cmFJbWdzKSA6IDAsXG5cdFx0XHRcdFx0XHRyb3RZID0gbW92ZU9wdHMucm90YXRlWSA/IDIgKiAoKGkrMSkqbW92ZU9wdHMucm90YXRlWS9zZWxmLm9wdGlvbnMuZXh0cmFJbWdzKSAvIHNlbGYudmlldy53aWR0aCAqIHJlbG1vdXNlcG9zLnggLSAoKGkrMSkqbW92ZU9wdHMucm90YXRlWS9zZWxmLm9wdGlvbnMuZXh0cmFJbWdzKSA6IDAsXG5cdFx0XHRcdFx0XHRyb3RaID0gbW92ZU9wdHMucm90YXRlWiA/IDIgKiAoKGkrMSkqbW92ZU9wdHMucm90YXRlWi9zZWxmLm9wdGlvbnMuZXh0cmFJbWdzKSAvIHNlbGYudmlldy53aWR0aCAqIHJlbG1vdXNlcG9zLnggLSAoKGkrMSkqbW92ZU9wdHMucm90YXRlWi9zZWxmLm9wdGlvbnMuZXh0cmFJbWdzKSA6IDAsXG5cdFx0XHRcdFx0XHR0cmFuc1ggPSBtb3ZlT3B0cy50cmFuc2xhdGVYID8gMiAqICgoaSsxKSptb3ZlT3B0cy50cmFuc2xhdGVYL3NlbGYub3B0aW9ucy5leHRyYUltZ3MpIC8gc2VsZi52aWV3LndpZHRoICogcmVsbW91c2Vwb3MueCAtICgoaSsxKSptb3ZlT3B0cy50cmFuc2xhdGVYL3NlbGYub3B0aW9ucy5leHRyYUltZ3MpIDogMCxcblx0XHRcdFx0XHRcdHRyYW5zWSA9IG1vdmVPcHRzLnRyYW5zbGF0ZVkgPyAyICogKChpKzEpKm1vdmVPcHRzLnRyYW5zbGF0ZVkvc2VsZi5vcHRpb25zLmV4dHJhSW1ncykgLyBzZWxmLnZpZXcuaGVpZ2h0ICogcmVsbW91c2Vwb3MueSAtICgoaSsxKSptb3ZlT3B0cy50cmFuc2xhdGVZL3NlbGYub3B0aW9ucy5leHRyYUltZ3MpIDogMCxcblx0XHRcdFx0XHRcdHRyYW5zWiA9IG1vdmVPcHRzLnRyYW5zbGF0ZVogPyAyICogKChpKzEpKm1vdmVPcHRzLnRyYW5zbGF0ZVovc2VsZi5vcHRpb25zLmV4dHJhSW1ncykgLyBzZWxmLnZpZXcuaGVpZ2h0ICogcmVsbW91c2Vwb3MueSAtICgoaSsxKSptb3ZlT3B0cy50cmFuc2xhdGVaL3NlbGYub3B0aW9ucy5leHRyYUltZ3MpIDogMDtcblxuXHRcdFx0XHRcdGVsLnN0eWxlLldlYmtpdFRyYW5zZm9ybSA9ICdwZXJzcGVjdGl2ZSgnICsgbW92ZU9wdHMucGVyc3BlY3RpdmUgKyAncHgpIHRyYW5zbGF0ZTNkKCcgKyB0cmFuc1ggKyAncHgsJyArIHRyYW5zWSArICdweCwnICsgdHJhbnNaICsgJ3B4KSByb3RhdGUzZCgxLDAsMCwnICsgcm90WCArICdkZWcpIHJvdGF0ZTNkKDAsMSwwLCcgKyByb3RZICsgJ2RlZykgcm90YXRlM2QoMCwwLDEsJyArIHJvdFogKyAnZGVnKSc7XG5cdFx0XHRcdFx0ZWwuc3R5bGUudHJhbnNmb3JtID0gJ3BlcnNwZWN0aXZlKCcgKyBtb3ZlT3B0cy5wZXJzcGVjdGl2ZSArICdweCkgdHJhbnNsYXRlM2QoJyArIHRyYW5zWCArICdweCwnICsgdHJhbnNZICsgJ3B4LCcgKyB0cmFuc1ogKyAncHgpIHJvdGF0ZTNkKDEsMCwwLCcgKyByb3RYICsgJ2RlZykgcm90YXRlM2QoMCwxLDAsJyArIHJvdFkgKyAnZGVnKSByb3RhdGUzZCgwLDAsMSwnICsgcm90WiArICdkZWcpJztcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHQvLyByZXNldCBhbGwgd2hlbiBtb3VzZSBsZWF2ZXMgdGhlIG1haW4gd3JhcHBlci5cblx0XHR0aGlzLnRpbHRXcmFwcGVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBmdW5jdGlvbihldikge1xuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdGZvcih2YXIgaSA9IDAsIGxlbiA9IHNlbGYuaW1nRWxlbXMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcblx0XHRcdFx0dmFyIGVsID0gc2VsZi5pbWdFbGVtc1tpXTtcblx0XHRcdFx0ZWwuc3R5bGUuV2Via2l0VHJhbnNmb3JtID0gJ3BlcnNwZWN0aXZlKCcgKyBtb3ZlT3B0cy5wZXJzcGVjdGl2ZSArICdweCkgdHJhbnNsYXRlM2QoMCwwLDApIHJvdGF0ZTNkKDEsMSwxLDBkZWcpJztcblx0XHRcdFx0ZWwuc3R5bGUudHJhbnNmb3JtID0gJ3BlcnNwZWN0aXZlKCcgKyBtb3ZlT3B0cy5wZXJzcGVjdGl2ZSArICdweCkgdHJhbnNsYXRlM2QoMCwwLDApIHJvdGF0ZTNkKDEsMSwxLDBkZWcpJztcblx0XHRcdH1cblx0XHRcdH0sIDYwKTtcblxuXHRcdH0pO1xuXG5cdFx0Ly8gd2luZG93IHJlc2l6ZVxuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aHJvdHRsZShmdW5jdGlvbihldikge1xuXHRcdFx0Ly8gcmVjYWxjdWxhdGUgdGlsdFdyYXBwZXIgcHJvcGVydGllczogd2lkdGgvaGVpZ2h0L2xlZnQvdG9wXG5cdFx0XHRzZWxmLnZpZXcgPSB7IHdpZHRoIDogc2VsZi50aWx0V3JhcHBlci5vZmZzZXRXaWR0aCwgaGVpZ2h0IDogc2VsZi50aWx0V3JhcHBlci5vZmZzZXRIZWlnaHQgfTtcblx0XHR9LCA1MCkpO1xuXHR9O1xuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0Ly8gc2VhcmNoIGZvciBpbWdzIHdpdGggdGhlIGNsYXNzIFwidGlsdC1lZmZlY3RcIlxuXHRcdFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW1nLnRpbHQtZWZmZWN0JykpLmZvckVhY2goZnVuY3Rpb24oaW1nKSB7XG5cdFx0XHRuZXcgVGlsdEZ4KGltZywgSlNPTi5wYXJzZShpbWcuZ2V0QXR0cmlidXRlKCdkYXRhLXRpbHQtb3B0aW9ucycpKSk7XG5cdFx0fSk7XG5cdH1cblxuXHRpbml0KCk7XG5cdHdpbmRvdy5UaWx0RnggPSBUaWx0Rng7XG5cblxufSkod2luZG93KTsiXSwiZmlsZSI6InRpbHRmeC5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
