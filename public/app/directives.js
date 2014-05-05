'use strict';

/* Directives */


angular.module('wasab.directives', [])
	.directive('appVersion', ['version', function(version) {
		return function(scope, elm, attrs) {
		elm.text(version);
		};
	}])
	.directive('wasabTrackSelectedTab', ['$location', function(location) {
    return {
        restrict: 'A',
        link: function(scope, element) {
            var $ul = angular.element(element);
            var tabMap = {};
            var $tabs = $ul.children();

            angular.forEach($tabs, function(key, value){
			var $li = angular.element(key);
              tabMap[$li.find('a').attr('href').substring(1)] = $li;            	
            });

            scope.location = location;
            scope.$watch('location.path()', function(newPath) {
            	var $el = tabMap[newPath];
            	if($el !== undefined){
	                $tabs.removeClass("selected");
	                tabMap[newPath].addClass("selected");
            	}
            });
        }
    }
 }])
 .directive('focusOnLoad', [function() {
    return {
        restrict: 'A',
        link: function(scope, el) {
            var $e = angular.element(el);
            el[0].focus();
        }
    }
 }])
 .directive('focusHandle', [function() {
    return {
        restrict: 'A',
        link: function(scope, el) {
            scope.$on("focus",function(event, selector){
                var found = angular.element(selector);
                if(found !== undefined && found !== null){
                    found.focus();
                }
            });
        }
    }
 }]);
