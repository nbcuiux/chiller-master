/**
 * borderMenu.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2013, Codrops
 * http://www.codrops.com
 */
(function() {

 	// http://stackoverflow.com/a/11381730/989439
	function mobilecheck() {
		var check = false;
		(function(a){if(/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
		return check;
	}

	function init() {

		var menu = document.getElementById( 'bt-menu' ),
			trigger = menu.querySelector( 'a.bt-menu-trigger' ),
			// triggerPlay only for demo 6
			triggerPlay = document.querySelector( 'a.bt-menu-trigger-out' ),
			// event type (if mobile use touch events)
			eventtype = mobilecheck() ? 'touchstart' : 'click',
			resetMenu = function() {
				classie.remove( menu, 'bt-menu-open' );
				classie.add( menu, 'bt-menu-close' );
			},
			closeClickFn = function( ev ) {
				resetMenu();
				overlay.removeEventListener( eventtype, closeClickFn );
			};

		var overlay = document.createElement('div');
		overlay.className = 'overlay';
		menu.appendChild( overlay );

		trigger.addEventListener( eventtype, function( ev ) {
			ev.stopPropagation();
			ev.preventDefault();
			
			if( classie.has( menu, 'bt-menu-open' ) ) {
				resetMenu();
			}
			else {
				classie.remove( menu, 'bt-menu-close' );
				classie.add( menu, 'bt-menu-open' );
				overlay.addEventListener( eventtype, closeClickFn );
			}
		});

		if( triggerPlay ) {
			triggerPlay.addEventListener( eventtype, function( ev ) {
				ev.stopPropagation();
				ev.preventDefault();

				classie.remove( menu, 'bt-menu-close' );
				classie.add( menu, 'bt-menu-open' );
				overlay.addEventListener( eventtype, closeClickFn );
			});
		}

		$('.bt-menu li a').on('click', function() {
			closeClickFn();
		});

	}

	init();

})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ0b3AtbmF2aWdhdGlvbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIGJvcmRlck1lbnUuanMgdjEuMC4wXG4gKiBodHRwOi8vd3d3LmNvZHJvcHMuY29tXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAqIFxuICogQ29weXJpZ2h0IDIwMTMsIENvZHJvcHNcbiAqIGh0dHA6Ly93d3cuY29kcm9wcy5jb21cbiAqL1xuKGZ1bmN0aW9uKCkge1xuXG4gXHQvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xMTM4MTczMC85ODk0Mzlcblx0ZnVuY3Rpb24gbW9iaWxlY2hlY2soKSB7XG5cdFx0dmFyIGNoZWNrID0gZmFsc2U7XG5cdFx0KGZ1bmN0aW9uKGEpe2lmKC8oYW5kcm9pZHxpcGFkfHBsYXlib29rfHNpbGt8YmJcXGQrfG1lZWdvKS4rbW9iaWxlfGF2YW50Z298YmFkYVxcL3xibGFja2JlcnJ5fGJsYXplcnxjb21wYWx8ZWxhaW5lfGZlbm5lY3xoaXB0b3B8aWVtb2JpbGV8aXAoaG9uZXxvZCl8aXJpc3xraW5kbGV8bGdlIHxtYWVtb3xtaWRwfG1tcHxuZXRmcm9udHxvcGVyYSBtKG9ifGluKWl8cGFsbSggb3MpP3xwaG9uZXxwKGl4aXxyZSlcXC98cGx1Y2tlcnxwb2NrZXR8cHNwfHNlcmllcyg0fDYpMHxzeW1iaWFufHRyZW98dXBcXC4oYnJvd3NlcnxsaW5rKXx2b2RhZm9uZXx3YXB8d2luZG93cyAoY2V8cGhvbmUpfHhkYXx4aWluby9pLnRlc3QoYSl8fC8xMjA3fDYzMTB8NjU5MHwzZ3NvfDR0aHB8NTBbMS02XWl8Nzcwc3w4MDJzfGEgd2F8YWJhY3xhYyhlcnxvb3xzXFwtKXxhaShrb3xybil8YWwoYXZ8Y2F8Y28pfGFtb2l8YW4oZXh8bnl8eXcpfGFwdHV8YXIoY2h8Z28pfGFzKHRlfHVzKXxhdHR3fGF1KGRpfFxcLW18ciB8cyApfGF2YW58YmUoY2t8bGx8bnEpfGJpKGxifHJkKXxibChhY3xheil8YnIoZXx2KXd8YnVtYnxid1xcLShufHUpfGM1NVxcL3xjYXBpfGNjd2F8Y2RtXFwtfGNlbGx8Y2h0bXxjbGRjfGNtZFxcLXxjbyhtcHxuZCl8Y3Jhd3xkYShpdHxsbHxuZyl8ZGJ0ZXxkY1xcLXN8ZGV2aXxkaWNhfGRtb2J8ZG8oY3xwKW98ZHMoMTJ8XFwtZCl8ZWwoNDl8YWkpfGVtKGwyfHVsKXxlcihpY3xrMCl8ZXNsOHxleihbNC03XTB8b3N8d2F8emUpfGZldGN8Zmx5KFxcLXxfKXxnMSB1fGc1NjB8Z2VuZXxnZlxcLTV8Z1xcLW1vfGdvKFxcLnd8b2QpfGdyKGFkfHVuKXxoYWllfGhjaXR8aGRcXC0obXxwfHQpfGhlaVxcLXxoaShwdHx0YSl8aHAoIGl8aXApfGhzXFwtY3xodChjKFxcLXwgfF98YXxnfHB8c3x0KXx0cCl8aHUoYXd8dGMpfGlcXC0oMjB8Z298bWEpfGkyMzB8aWFjKCB8XFwtfFxcLyl8aWJyb3xpZGVhfGlnMDF8aWtvbXxpbTFrfGlubm98aXBhcXxpcmlzfGphKHR8dilhfGpicm98amVtdXxqaWdzfGtkZGl8a2VqaXxrZ3QoIHxcXC8pfGtsb258a3B0IHxrd2NcXC18a3lvKGN8ayl8bGUobm98eGkpfGxnKCBnfFxcLyhrfGx8dSl8NTB8NTR8XFwtW2Etd10pfGxpYnd8bHlueHxtMVxcLXd8bTNnYXxtNTBcXC98bWEodGV8dWl8eG8pfG1jKDAxfDIxfGNhKXxtXFwtY3J8bWUocmN8cmkpfG1pKG84fG9hfHRzKXxtbWVmfG1vKDAxfDAyfGJpfGRlfGRvfHQoXFwtfCB8b3x2KXx6eil8bXQoNTB8cDF8diApfG13YnB8bXl3YXxuMTBbMC0yXXxuMjBbMi0zXXxuMzAoMHwyKXxuNTAoMHwyfDUpfG43KDAoMHwxKXwxMCl8bmUoKGN8bSlcXC18b258dGZ8d2Z8d2d8d3QpfG5vayg2fGkpfG56cGh8bzJpbXxvcCh0aXx3dil8b3Jhbnxvd2cxfHA4MDB8cGFuKGF8ZHx0KXxwZHhnfHBnKDEzfFxcLShbMS04XXxjKSl8cGhpbHxwaXJlfHBsKGF5fHVjKXxwblxcLTJ8cG8oY2t8cnR8c2UpfHByb3h8cHNpb3xwdFxcLWd8cWFcXC1hfHFjKDA3fDEyfDIxfDMyfDYwfFxcLVsyLTddfGlcXC0pfHF0ZWt8cjM4MHxyNjAwfHJha3N8cmltOXxybyh2ZXx6byl8czU1XFwvfHNhKGdlfG1hfG1tfG1zfG55fHZhKXxzYygwMXxoXFwtfG9vfHBcXC0pfHNka1xcL3xzZShjKFxcLXwwfDEpfDQ3fG1jfG5kfHJpKXxzZ2hcXC18c2hhcnxzaWUoXFwtfG0pfHNrXFwtMHxzbCg0NXxpZCl8c20oYWx8YXJ8YjN8aXR8dDUpfHNvKGZ0fG55KXxzcCgwMXxoXFwtfHZcXC18diApfHN5KDAxfG1iKXx0MigxOHw1MCl8dDYoMDB8MTB8MTgpfHRhKGd0fGxrKXx0Y2xcXC18dGRnXFwtfHRlbChpfG0pfHRpbVxcLXx0XFwtbW98dG8ocGx8c2gpfHRzKDcwfG1cXC18bTN8bTUpfHR4XFwtOXx1cChcXC5ifGcxfHNpKXx1dHN0fHY0MDB8djc1MHx2ZXJpfHZpKHJnfHRlKXx2ayg0MHw1WzAtM118XFwtdil8dm00MHx2b2RhfHZ1bGN8dngoNTJ8NTN8NjB8NjF8NzB8ODB8ODF8ODN8ODV8OTgpfHczYyhcXC18ICl8d2ViY3x3aGl0fHdpKGcgfG5jfG53KXx3bWxifHdvbnV8eDcwMHx5YXNcXC18eW91cnx6ZXRvfHp0ZVxcLS9pLnRlc3QoYS5zdWJzdHIoMCw0KSkpY2hlY2sgPSB0cnVlfSkobmF2aWdhdG9yLnVzZXJBZ2VudHx8bmF2aWdhdG9yLnZlbmRvcnx8d2luZG93Lm9wZXJhKTtcblx0XHRyZXR1cm4gY2hlY2s7XG5cdH1cblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXG5cdFx0dmFyIG1lbnUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggJ2J0LW1lbnUnICksXG5cdFx0XHR0cmlnZ2VyID0gbWVudS5xdWVyeVNlbGVjdG9yKCAnYS5idC1tZW51LXRyaWdnZXInICksXG5cdFx0XHQvLyB0cmlnZ2VyUGxheSBvbmx5IGZvciBkZW1vIDZcblx0XHRcdHRyaWdnZXJQbGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJ2EuYnQtbWVudS10cmlnZ2VyLW91dCcgKSxcblx0XHRcdC8vIGV2ZW50IHR5cGUgKGlmIG1vYmlsZSB1c2UgdG91Y2ggZXZlbnRzKVxuXHRcdFx0ZXZlbnR0eXBlID0gbW9iaWxlY2hlY2soKSA/ICd0b3VjaHN0YXJ0JyA6ICdjbGljaycsXG5cdFx0XHRyZXNldE1lbnUgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y2xhc3NpZS5yZW1vdmUoIG1lbnUsICdidC1tZW51LW9wZW4nICk7XG5cdFx0XHRcdGNsYXNzaWUuYWRkKCBtZW51LCAnYnQtbWVudS1jbG9zZScgKTtcblx0XHRcdH0sXG5cdFx0XHRjbG9zZUNsaWNrRm4gPSBmdW5jdGlvbiggZXYgKSB7XG5cdFx0XHRcdHJlc2V0TWVudSgpO1xuXHRcdFx0XHRvdmVybGF5LnJlbW92ZUV2ZW50TGlzdGVuZXIoIGV2ZW50dHlwZSwgY2xvc2VDbGlja0ZuICk7XG5cdFx0XHR9O1xuXG5cdFx0dmFyIG92ZXJsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRvdmVybGF5LmNsYXNzTmFtZSA9ICdvdmVybGF5Jztcblx0XHRtZW51LmFwcGVuZENoaWxkKCBvdmVybGF5ICk7XG5cblx0XHR0cmlnZ2VyLmFkZEV2ZW50TGlzdGVuZXIoIGV2ZW50dHlwZSwgZnVuY3Rpb24oIGV2ICkge1xuXHRcdFx0ZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XG5cdFx0XHRpZiggY2xhc3NpZS5oYXMoIG1lbnUsICdidC1tZW51LW9wZW4nICkgKSB7XG5cdFx0XHRcdHJlc2V0TWVudSgpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGNsYXNzaWUucmVtb3ZlKCBtZW51LCAnYnQtbWVudS1jbG9zZScgKTtcblx0XHRcdFx0Y2xhc3NpZS5hZGQoIG1lbnUsICdidC1tZW51LW9wZW4nICk7XG5cdFx0XHRcdG92ZXJsYXkuYWRkRXZlbnRMaXN0ZW5lciggZXZlbnR0eXBlLCBjbG9zZUNsaWNrRm4gKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGlmKCB0cmlnZ2VyUGxheSApIHtcblx0XHRcdHRyaWdnZXJQbGF5LmFkZEV2ZW50TGlzdGVuZXIoIGV2ZW50dHlwZSwgZnVuY3Rpb24oIGV2ICkge1xuXHRcdFx0XHRldi5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRjbGFzc2llLnJlbW92ZSggbWVudSwgJ2J0LW1lbnUtY2xvc2UnICk7XG5cdFx0XHRcdGNsYXNzaWUuYWRkKCBtZW51LCAnYnQtbWVudS1vcGVuJyApO1xuXHRcdFx0XHRvdmVybGF5LmFkZEV2ZW50TGlzdGVuZXIoIGV2ZW50dHlwZSwgY2xvc2VDbGlja0ZuICk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHQkKCcuYnQtbWVudSBsaSBhJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRjbG9zZUNsaWNrRm4oKTtcblx0XHR9KTtcblxuXHR9XG5cblx0aW5pdCgpO1xuXG59KSgpOyJdLCJmaWxlIjoidG9wLW5hdmlnYXRpb24uanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
