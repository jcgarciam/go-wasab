'use strict';

/* Filters */

angular.module('wasab.filters', [])
.filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
 }])
.filter('paginator',[function(){
	return function(input, expression){
		console.log("The input is ",input)
		console.log("The expression is ",expression)

		return input;
	}
}]);
