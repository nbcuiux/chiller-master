function normalizeMenu() {
   var pageHref = window.location.href.split('/').pop(),
       queryString = 'nav dl a[href$="'+ pageHref + '"]',
       activeMenuItem = document.querySelector(queryString),
       activeMenu = activeMenuItem.parentNode.parentNode;

   activeMenuItem.classList.add('nav_selected');
   activeMenu.style.display = '';
}

window.onload = function() {
   normalizeMenu();
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtZW51LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIG5vcm1hbGl6ZU1lbnUoKSB7XG4gICB2YXIgcGFnZUhyZWYgPSB3aW5kb3cubG9jYXRpb24uaHJlZi5zcGxpdCgnLycpLnBvcCgpLFxuICAgICAgIHF1ZXJ5U3RyaW5nID0gJ25hdiBkbCBhW2hyZWYkPVwiJysgcGFnZUhyZWYgKyAnXCJdJyxcbiAgICAgICBhY3RpdmVNZW51SXRlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IocXVlcnlTdHJpbmcpLFxuICAgICAgIGFjdGl2ZU1lbnUgPSBhY3RpdmVNZW51SXRlbS5wYXJlbnROb2RlLnBhcmVudE5vZGU7XG5cbiAgIGFjdGl2ZU1lbnVJdGVtLmNsYXNzTGlzdC5hZGQoJ25hdl9zZWxlY3RlZCcpO1xuICAgYWN0aXZlTWVudS5zdHlsZS5kaXNwbGF5ID0gJyc7XG59XG5cbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgIG5vcm1hbGl6ZU1lbnUoKTtcbn07Il0sImZpbGUiOiJtZW51LmpzIn0=
