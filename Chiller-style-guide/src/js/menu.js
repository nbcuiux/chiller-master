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