/*
 * cond - v0.1 - 6/10/2009
 * http://benalman.com/projects/jquery-cond-plugin/
 * 
 * Copyright (c) 2009 "Cowboy" Ben Alman
 * Licensed under the MIT license
 * http://benalman.com/about/license/
 * 
 * Based on suggestions and sample code by Stephen Band and DBJDBJ in the
 * jquery-dev Google group: http://bit.ly/jqba1
 */
(function($){$.fn.cond=function(){var e,a=arguments,b=0,f,d,c;while(!f&&b<a.length){f=a[b++];d=a[b++];f=$.isFunction(f)?f.call(this):f;c=!d?f:f?d.call(this,f):e}return c!==e?c:this}})(jQuery);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjb250cm9sLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBjb25kIC0gdjAuMSAtIDYvMTAvMjAwOVxuICogaHR0cDovL2JlbmFsbWFuLmNvbS9wcm9qZWN0cy9qcXVlcnktY29uZC1wbHVnaW4vXG4gKiBcbiAqIENvcHlyaWdodCAoYykgMjAwOSBcIkNvd2JveVwiIEJlbiBBbG1hblxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKiBodHRwOi8vYmVuYWxtYW4uY29tL2Fib3V0L2xpY2Vuc2UvXG4gKiBcbiAqIEJhc2VkIG9uIHN1Z2dlc3Rpb25zIGFuZCBzYW1wbGUgY29kZSBieSBTdGVwaGVuIEJhbmQgYW5kIERCSkRCSiBpbiB0aGVcbiAqIGpxdWVyeS1kZXYgR29vZ2xlIGdyb3VwOiBodHRwOi8vYml0Lmx5L2pxYmExXG4gKi9cbihmdW5jdGlvbigkKXskLmZuLmNvbmQ9ZnVuY3Rpb24oKXt2YXIgZSxhPWFyZ3VtZW50cyxiPTAsZixkLGM7d2hpbGUoIWYmJmI8YS5sZW5ndGgpe2Y9YVtiKytdO2Q9YVtiKytdO2Y9JC5pc0Z1bmN0aW9uKGYpP2YuY2FsbCh0aGlzKTpmO2M9IWQ/ZjpmP2QuY2FsbCh0aGlzLGYpOmV9cmV0dXJuIGMhPT1lP2M6dGhpc319KShqUXVlcnkpOyJdLCJmaWxlIjoiY29udHJvbC5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
