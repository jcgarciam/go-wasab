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
  $routeProvider.when('/groups/application/:appId',  {templateUrl: 'partials/groups/index.html', controller : 'GroupsCtrl'});
  $routeProvider.when('/groups/new',  {templateUrl: 'partials/groups/add.html', controller:'GroupsNewCtrl'});
  $routeProvider.when('/groups/edit/:id',  { templateUrl: 'partials/groups/edit.html', controller:'GroupsEditCtrl'});  

  $routeProvider.when('/operations',  {templateUrl: 'partials/operations/index.html', controller : 'OperationsCtrl'});
  $routeProvider.when('/operations/application/:appId',  {templateUrl: 'partials/operations/index.html', controller : 'OperationsCtrl'});
  $routeProvider.when('/operations/new',  {templateUrl: 'partials/operations/add.html', controller:'OperationsNewCtrl'});
  $routeProvider.when('/operations/edit/:id',  { templateUrl: 'partials/operations/edit.html', controller:'OperationsEditCtrl'});  

  $routeProvider.when('/roles',  {templateUrl: 'partials/roles/index.html', controller : 'RolesCtrl'});
  $routeProvider.when('/roles/application/:appId',  {templateUrl: 'partials/roles/index.html', controller : 'RolesCtrl'});
  $routeProvider.when('/roles/new',  {templateUrl: 'partials/roles/add.html', controller:'RolesNewCtrl'});
  $routeProvider.when('/roles/edit/:id',  { templateUrl: 'partials/roles/edit.html', controller:'RolesEditCtrl'});  

  $routeProvider.when('/users',  {templateUrl: 'partials/users/index.html', controller : 'UsersCtrl'});
  $routeProvider.when('/users/new',  {templateUrl: 'partials/users/add.html', controller:'UsersNewCtrl'});
  $routeProvider.when('/users/edit/:id',  { templateUrl: 'partials/users/edit.html', controller:'UsersEditCtrl'});  

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
           //config.url = config.url + ("?_="+(Math.random() * 0xffffffff | 1));
          return config;
        },
        ///Global Error Handler
        ///TODO: Define elegant popup :)
        'responseError': function(rejection){
          //alert("Error:\n "+"-------------------\n"+rejection.data);
          var message = rejection.data;
          if(message === "" || message === undefined){
            message = "Oops it seems there is a problem buddy!";
          }

          var htmlMessage = [];
          
          htmlMessage.push("<div class='ui-state-error ui-corner-all' style='padding: 0 .7em;''>");
          htmlMessage.push(message);
          htmlMessage.push("</diV>");

          $("#popup-holder").html(htmlMessage.join("")).dialog({
            modal:true,
            title:"Error processing your request!"
          });

          return $q.reject(rejection);
        }
      };
    });    
}]);