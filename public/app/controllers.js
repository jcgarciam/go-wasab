'use strict';

/* Controllers */

angular.module('wasab.controllers', [])
	.controller("TopContainerCtrl",['$scope','$location',function($scope, $location) {
		//Global items
		$scope.itemsPerPage		= 10;
		$scope.totalElements	= 0;
		$scope.imageByName = function(app){
			if(app.enabled)
				return "tick";
			return "cross";
		};		
		$scope.paginateList		= function (promiseData, pageIndex, $targetScope){
			$scope.totalElements		= promiseData.length;
			$targetScope.pagedList 		= []
			$targetScope.currentPage	= pageIndex || 0;

			for (var i = 0; i < promiseData.length; i++) {
			    if (i % $targetScope.itemsPerPage === 0) {
			        $targetScope.pagedList[Math.floor(i / $targetScope.itemsPerPage)] = [ promiseData[i] ];
			    } else {
			        $targetScope.pagedList[Math.floor(i / $targetScope.itemsPerPage)].push(promiseData[i]);
			    }
			}	
			if($targetScope.pagedList > $targetScope.currentPage){
				$targetScope.currentPage = 0;
			}
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
	}]) /* Groups */
	.controller('GroupsCtrl', ['$scope', 'ApplicationsRepository','GroupsRepository',
		'$routeParams','$filter',
		function($scope, ApplicationsRepository, GroupsRepository, $routeParams, $filter) {
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
					$scope.searchGroupsByApp($scope.selectedApp);
				}
			});

			$scope.nextPage = function(lstSize){
				if($scope.currentPage < lstSize - 1){
					$scope.currentPage = $scope.currentPage + 1;
				}
			};
			$scope.prevPage = function(lstSize){
				if($scope.currentPage > 0){
					$scope.currentPage = $scope.currentPage - 1;
				}
			};

			$scope.searchGroupsByApp = function(app){
				$scope.groupsList 	= GroupsRepository.queryByAppId({appId : app.id});
				$scope.groupsList.$promise.then(function(data){
					$scope.paginateList(data, 0 , $scope);
				});
			};
			$scope.filterByGroup = function(query, pageIndex /*this is called from delete operation*/){
				$scope.groupsList.$promise.then(function(data){
					var filtered = data;
					if(query !== undefined && query.length > 0){
						filtered = $filter("filter")(data, query, function(actual,expected){
							if(actual.toString().indexOf(expected.toUpperCase()) !== -1){
								return true;
							}
							return false;
						});						
					}
					$scope.paginateList(filtered, pageIndex || 0, $scope);
				});
			};
			
			$scope.deleteGroup = function(app){
				if(confirm("Are you sure?") === true){
					var result = GroupsRepository.delete({id:app.id});
					result.$promise
					.then(function(){
						for(var i = 0; i < $scope.groupsList.length; i++){
							if($scope.groupsList[i] === app){
								$scope.groupsList.splice(i, 1)	
								$scope.filterByGroup($scope.filterGroupName, $scope.currentPage);
								break;
							}
						}
					});
				}
			};
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
	}]) /*Operations*/
		.controller('OperationsCtrl', ['$scope', 'ApplicationsRepository','OperationsRepository',
		'$routeParams','$filter',
		function($scope, ApplicationsRepository, OperationsRepository, $routeParams, $filter) {
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

					$scope.searchOperationsByApp($scope.selectedApp);
				}
			});
			$scope.searchOperationsByApp = function(app){
				$scope.operationsList 	= OperationsRepository.queryByAppId({appId : app.id});
				$scope.operationsList.$promise.then(function(data){
					$scope.paginateList(data, 0 , $scope);
				});
			};
			$scope.filterByOperation = function(query, pageIndex){
				$scope.operationsList.$promise.then(function(data){
					var filtered = data;
					if(query !== undefined && query.length > 0){
						filtered = $filter("filter")(data, query, function(actual, expected){
							if(actual.toString().indexOf(expected.toUpperCase()) !== -1){
								return true;
							}
							return false;
						});						
					}
					$scope.paginateList(filtered, pageIndex || 0, $scope);
				});
			};

			$scope.deleteOperation = function(app){
				if(confirm("Are you sure?") === true){
					var result = OperationsRepository.delete({id:app.id});
					result.$promise
					.then(function(){
						for(var i = 0; i < $scope.operationsList.length; i++){
							if($scope.operationsList[i] === app){
								$scope.operationsList.splice(i, 1);
								$scope.filterByOperation($scope.filterGroupName, $scope.currentPage);
								break;

							}
						}
					});
				}
			};
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
			};
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
			};	
	}]) /*Roles*/
	.controller('RolesCtrl', ['$scope', 'ApplicationsRepository','RolesRepository',
		'$routeParams','$filter',
		function($scope, ApplicationsRepository, RolesRepository, $routeParams, $filter) {
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
					$scope.searchRolesByApp($scope.selectedApp);
				}
			});
			$scope.nextPage = function(lstSize){
				if($scope.currentPage < lstSize - 1){
					$scope.currentPage = $scope.currentPage + 1;
				}
			};
			$scope.prevPage = function(lstSize){
				if($scope.currentPage > 0){
					$scope.currentPage = $scope.currentPage - 1;
				}
			};

			$scope.searchRolesByApp = function(app){
				$scope.rolesList 	= RolesRepository.queryByAppId({appId : app.id});
				$scope.rolesList.$promise.then(function(data){
					$scope.paginateList(data, 0 , $scope);
				});
			};
			$scope.filterByRole = function(query, pageIndex /*this is called from delete operation*/){
				$scope.rolesList.$promise.then(function(data){
					var filtered = data;
					if(query !== undefined && query.length > 0){
						filtered = $filter("filter")(data, query, function(actual,expected){
							if(actual.toString().indexOf(expected.toUpperCase()) !== -1){
								return true;
							}
							return false;
						});						
					}
					$scope.paginateList(filtered, pageIndex || 0, $scope);
				});
			};
			
			$scope.deleteRole = function(app){
				if(confirm("Are you sure?") === true){
					var result = RolesRepository.delete({id:app.id});
					result.$promise
					.then(function(){
						for(var i = 0; i < $scope.rolesList.length; i++){
							if($scope.rolesList[i] === app){
								$scope.rolesList.splice(i, 1)	
								$scope.filterByRole($scope.filterGroupName, $scope.currentPage);
								break;
							}
						}
					});
				}
			};
	}])	
	.controller('RolesNewCtrl', ['$scope','$location','ApplicationsRepository',
		'RolesRepository',
		function($scope, $location, ApplicationsRepository, RolesRepository) {
			$scope.applicationList  = ApplicationsRepository.query();
			$scope.AddRole = function(){
				var grp = new RolesRepository($scope.newgrp);
				grp.application_id = $scope.selectedApp.id;
				var result = RolesRepository.create(grp);
				result.$promise.then(function(){
					$location.path("/roles");
				});
			}		
	}])
	.controller('RolesEditCtrl', ['$scope','$location','ApplicationsRepository',
		'RolesRepository','$routeParams',
		function($scope, $location, ApplicationsRepository,
		 RolesRepository, $routeParams) {
			$scope.editapp = RolesRepository.byId({id : $routeParams.id});
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

			$scope.EditRole = function(){
				var grp = new RolesRepository($scope.editapp);
				grp.application_id = $scope.selectedApp.id;

				var result = RolesRepository.update(grp);
				result.$promise.then(function(){
					$location.path("/roles/application/"+grp.application_id);
				});
			}		
	}])/*Users*/
	.controller('UsersCtrl', ['$scope', 'ApplicationsRepository','UsersRepository',
		'$routeParams','$filter',
		function($scope, ApplicationsRepository, UsersRepository, $routeParams, $filter) {
			$scope.usersList 	= UsersRepository.query();
			$scope.usersList.$promise.then(function(data){
				$scope.paginateList(data, 0 , $scope);
			});

			$scope.nextPage = function(lstSize){
				if($scope.currentPage < lstSize - 1){
					$scope.currentPage = $scope.currentPage + 1;
				}
			};
			$scope.prevPage = function(lstSize){
				if($scope.currentPage > 0){
					$scope.currentPage = $scope.currentPage - 1;
				}
			};

			$scope.filterByUser = function(query, pageIndex /*this is called from delete operation*/){
				$scope.usersList.$promise.then(function(data){
					var filtered = data;
					if(query !== undefined && query.length > 0){
						filtered = $filter("filter")(data, query, function(actual,expected){
							if(actual.toString().indexOf(expected.toUpperCase()) !== -1){
								return true;
							}
							return false;
						});						
					}
					$scope.paginateList(filtered, pageIndex || 0, $scope);
				});
			};
	}])	
	.controller('UsersNewCtrl', ['$scope','$location','ApplicationsRepository',
		'UsersRepository',
		function($scope, $location, ApplicationsRepository, UsersRepository) {
			$scope.AddUser = function(){
				var grp = new UsersRepository($scope.newgrp);
				var result = UsersRepository.create(grp);
				result.$promise.then(function(){
					$location.path("/users");
				});
			}		
	}])
	.controller('UsersEditCtrl', ['$scope','$location','ApplicationsRepository',
		'UsersRepository','$routeParams',
		function($scope, $location, ApplicationsRepository,
		 UsersRepository, $routeParams) {
			$scope.editapp = UsersRepository.byId({id : $routeParams.id});

			$scope.EditUser = function(){
				var grp = new UsersRepository($scope.editapp);
				var result = UsersRepository.update(grp);
				result.$promise.then(function(){
					$location.path("/users");
				});
			}		
	}]);

