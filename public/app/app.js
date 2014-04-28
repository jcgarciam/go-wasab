'use strict';


// Declare app level module which depends on filters, and services
angular.module('wasab', [
  'ngRoute',
  'ngResource',
  'wasab.filters',
  'wasab.services',
  'wasab.directives',
  'wasab.controllers'
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/dashboard', 		{templateUrl: 'partials/dashboard.html',controller: 'DashboardCtrl'});
  $routeProvider.when('/applications',  {templateUrl: 'partials/applications/index.html', controller : 'ApplicationsCtrl'});
  $routeProvider.when('/applications/new',	{templateUrl: 'partials/applications/add.html', controller:'ApplicationsNewCtrl'});
  $routeProvider.when('/applications/edit/:id',  { templateUrl: 'partials/applications/edit.html', controller:'ApplicationsEditCtrl'});  
  $routeProvider.otherwise({redirectTo: '/dashboard'});
}])
.config(['$httpProvider', function($httpProvider) {
    //initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};    
    }

    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
    ///Prevent Caching
    $httpProvider.interceptors.push(function() {
      return {
        'request':function(config){
           config.url = config.url + ("?_="+(Math.random() * 0xffffffff | 1));
          return config;
        }
      };
    });    

}]);