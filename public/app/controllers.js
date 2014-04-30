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
		'$routeParams',
		function($scope, ApplicationsRepository, GroupsRepository, $routeParams) {
		$scope.applicationList  = ApplicationsRepository.query();
		$scope.applicationList.$promise.then(function(data){
			if(data.length > 0){
				var paramAppId = parseInt($routeParams.appId) || 0 ;
				if(paramAppId > 0){
					for(var i = 0; i< data.length; i++){
						if(data[i].id === paramAppId){
							$scope.selectedApp = data[i];
							break;
						}
					}
				}else{
					$scope.selectedApp = data[0];
				}

				$scope.searchGroups($scope.selectedApp);
			}
		});
		$scope.searchGroups = function(app){
			$scope.groupsList 		= GroupsRepository.queryByAppId({appId : app.id});
		}
		$scope.deleteGroup = function(app){
			if(confirm("Are you sure?") === true){
				var result = GroupsRepository.delete({id:app.id});
				result.$promise
				.then(function(){
					for(var i = 0; i < $scope.groupsList.length; i++){
						if($scope.groupsList[i] === app){
							$scope.groupsList.splice(i, 1)	
						}
					}
				});
			}
		}
	}])	
	.controller('GroupsNewCtrl', ['$scope','$location','ApplicationsRepository',
		'GroupsRepository',
		function($scope, $location, ApplicationsRepository, GroupsRepository) {
			$scope.applicationList  = ApplicationsRepository.query();
			$scope.AddGroup = function(){
				var grp = new GroupsRepository($scope.newgrp);
				grp.application_id = $scope.selectedApp.id;
				var result = GroupsRepository.create(grp);
				result.$promise.then(function(){
					$location.path("/groups");
				});
			}		
	}])
	.controller('GroupsEditCtrl', ['$scope','$location','ApplicationsRepository',
		'GroupsRepository','$routeParams',
		function($scope, $location, ApplicationsRepository,
		 GroupsRepository, $routeParams) {
			$scope.editapp = GroupsRepository.byId({id : $routeParams.id});
			$scope.editapp.$promise.then(function(data){
			 	$scope.applicationList  = ApplicationsRepository.query();
			 	$scope.applicationList.$promise.then(function(data){
			 		for(var i= 0; i < data.length; i++){
			 			if(data[i].id === $scope.editapp.application_id){
							$scope.selectedApp = data[i];
							break;
			 			}
			 		}
			 	});
			});

			$scope.EditGroup = function(){
				var grp = new GroupsRepository($scope.editapp);
				grp.application_id = $scope.selectedApp.id;

				var result = GroupsRepository.update(grp);
				result.$promise.then(function(){
					$location.path("/groups/application/"+grp.application_id);
				});
			}		
		}])
	.controller('OperationsCtrl', ['$scope', 'ApplicationsRepository','OperationsRepository',
		'$routeParams',
		function($scope, ApplicationsRepository, OperationsRepository, $routeParams) {
			$scope.applicationList  = ApplicationsRepository.query();
			$scope.applicationList.$promise.then(function(data){
				if(data.length > 0){
					var paramAppId = parseInt($routeParams.appId) || 0 ;
					if(paramAppId > 0){
						for(var i = 0; i< data.length; i++){
							if(data[i].id === paramAppId){
								$scope.selectedApp = data[i];
								break;
							}
						}
					}else{
						$scope.selectedApp = data[0];
					}

					$scope.searchOperations($scope.selectedApp);
				}
			});
			$scope.searchOperations = function(app){
				$scope.operationsList 	= OperationsRepository.queryByAppId({appId : app.id});
			}
			$scope.deleteOperation = function(app){
				if(confirm("Are you sure?") === true){
					var result = OperationsRepository.delete({id:app.id});
					result.$promise
					.then(function(){
						for(var i = 0; i < $scope.operationsList.length; i++){
							if($scope.operationsList[i] === app){
								$scope.operationsList.splice(i, 1)	
							}
						}
					});
				}
			}
	}])	
	.controller('OperationsNewCtrl', ['$scope','$location','ApplicationsRepository',
		'OperationsRepository',
		function($scope, $location, ApplicationsRepository, OperationsRepository) {
			$scope.applicationList  = ApplicationsRepository.query();
			$scope.AddOperation = function(){
				var oper = new OperationsRepository($scope.newoper);
				oper.application_id = $scope.selectedApp.id;
				var result = OperationsRepository.create(oper);
				result.$promise.then(function(){
					$location.path("/operations");
				});
			}		
	}])
	.controller('OperationsEditCtrl', ['$scope','$location','ApplicationsRepository',
		'OperationsRepository','$routeParams',
		function($scope, $location, ApplicationsRepository,
		 OperationsRepository, $routeParams) {
			$scope.editapp = OperationsRepository.byId({id : $routeParams.id});
			$scope.editapp.$promise.then(function(data){
			 	$scope.applicationList  = ApplicationsRepository.query();
			 	$scope.applicationList.$promise.then(function(data){
			 		for(var i= 0; i < data.length; i++){
			 			if(data[i].id === $scope.editapp.application_id){
							$scope.selectedApp = data[i];
							break;
			 			}
			 		}
			 	});
			});

			$scope.EditOperation = function(){
				var oper = new OperationsRepository($scope.editapp);
				oper.application_id = $scope.selectedApp.id;

				var result = OperationsRepository.update(oper);
				result.$promise.then(function(){
					$location.path("/operations/application/"+oper.application_id);
				});
			}		
	}]);

