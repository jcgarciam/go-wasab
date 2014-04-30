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

  $routeProvider.when('/groups',  {templateUrl: 'partials/groups/index.html', controller : 'GroupsCtrl'});
  $routeProvider.when('/groups/new',  {templateUrl: 'partials/groups/add.html', controller:'GroupsNewCtrl'});
  $routeProvider.when('/groups/edit/:id',  { templateUrl: 'partials/groups/edit.html', controller:'GroupsEditCtrl'});  

  $routeProvider.otherwise({redirectTo: '/dashboard'});
}])
.config(['$httpProvider', function($httpProvider) {
    //initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};    
    }

    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
    $httpProvider.interceptors.push(function($q) {
      return {
        ///Prevent Caching
        'request': function(config){
           config.url = config.url + ("?_="+(Math.random() * 0xffffffff | 1));
          return config;
        },
        ///Global Error Handler
        ///TODO: Define elegant popup :)
        'responseError': function(rejection){
          alert("Error:\n "+"-------------------\n"+rejection.data);
          return $q.reject(rejection);
        }
      };
    });    
}]);