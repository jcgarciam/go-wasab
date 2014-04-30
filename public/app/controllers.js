'use strict';

/* Controllers */

angular.module('wasab.controllers', [])
	.controller("TopContainerCtrl",['$scope','$location',function($scope, $location) {
		$scope.feedbacksMessages = [];
		$scope.hasFeedbaks = function(){
			return $scope.feedbacksMessages.length > 0;
		}
	}])
	.controller('DashboardCtrl', ['$scope',function($scope) {

	}])
	.controller('ApplicationsCtrl', ['$scope', 'ApplicationsRepository',
		function($scope, ApplicationsRepository) {
		$scope.applicationList  = ApplicationsRepository.query();
		$scope.deleteApplication = function(app){
			if(confirm("Are you sure?") === true){
				var result = ApplicationsRepository.delete({id:app.id});
				result.$promise
				.then(function(){
					for(var i = 0; i < $scope.applicationList.length; i++){
						if($scope.applicationList[i] === app){
							$scope.applicationList.splice(i, 1)	
						}
					}
				});
			}
		}
	}])	
	.controller('ApplicationsNewCtrl', ['$scope','$location','ApplicationsRepository',
		function($scope, $location, ApplicationsRepository) {
		$scope.AddApplication = function(){
			var app = new ApplicationsRepository($scope.newapp);
			var result = ApplicationsRepository.create(app);
			result.$promise.then(function(){
				$location.path("/applications");
			});
		}		
	}])
	.controller('ApplicationsEditCtrl', ['$scope','$location','ApplicationsRepository', '$routeParams',
		function($scope, $location, ApplicationsRepository,$routeParams) {
		$scope.editapp = ApplicationsRepository.byId({id : $routeParams.id});
		$scope.EditApplication = function(){
			var app = new ApplicationsRepository($scope.editapp);
			var result = ApplicationsRepository.update(app);
			result.$promise.then(function(){
				$location.path("/applications");
			});
		}		
	}])
	.controller('GroupsCtrl', ['$scope', 'ApplicationsRepository','GroupsRepository',
		function($scope, ApplicationsRepository, GroupsRepository) {
		$scope.applicationList  = ApplicationsRepository.query();
		$scope.groupsList 		= GroupsRepository.query();
		$scope.deleteApplication = function(app){
			if(confirm("Are you sure?") === true){
				var result = ApplicationsRepository.delete({id:app.id});
				result.$promise
				.then(function(){
					for(var i = 0; i < $scope.applicationList.length; i++){
						if($scope.applicationList[i] === app){
							$scope.applicationList.splice(i, 1)	
						}
					}
				});
			}
		}
	}])	
	.controller('GroupsNewCtrl', ['$scope','$location','ApplicationsRepository',
		function($scope, $location, ApplicationsRepository) {
		$scope.AddApplication = function(){
			var app = new ApplicationsRepository($scope.newapp);
			var result = ApplicationsRepository.create(app);
			result.$promise.then(function(){
				$location.path("/applications");
			});
		}		
	}])
	.controller('GroupssEditCtrl', ['$scope','$location','ApplicationsRepository', '$routeParams',
		function($scope, $location, ApplicationsRepository,$routeParams) {
		$scope.editapp = ApplicationsRepository.byId({id : $routeParams.id});
		$scope.EditApplication = function(){
			var app = new ApplicationsRepository($scope.editapp);
			var result = ApplicationsRepository.update(app);
			result.$promise.then(function(){
				$location.path("/applications");
			});
		}		
	}])	;
