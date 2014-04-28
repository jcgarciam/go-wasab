'use strict';

/* Services */
angular.module('wasab.services', [])
.value('version', '0.1')
.service('Notification',['$resource','$rootScope',function($resource, $rootScope){

	return [];
}])
.service('ApplicationsRepository',['$resource',function($resource){
	var res = $resource('/admin/applications/:id', {id:'@id'}, {
		byId:{url:'/admin/applications/get/:id', params:{id:'@id'}},
		query:{url:'/admin/applications/list', isArray:true},
		create:{url:'/admin/applications/create', method:'POST'},
		update:{url:'/admin/applications/update', method:'POST'},
		delete:{url:'/admin/applications/delete/:id', params:{id:'@id'}, method:'POST'},
	});
	return res;
}])
.service('GroupsRepository',['$resource',function($resource){
	return $resource('/admin/groups/:id', {id:'@id'});
}])
.service('OperationsRepository',['$resource',function($resource){
	return $resource('/admin/operations/:id', {id:'@id'});
}])
.service('RolesRepository',['$resource',function($resource){
	return $resource('/admin/roles/:id', {id:'@id'});
}])
.service('RolesGroupsRepository',['$resource',function($resource){
	return $resource('/admin/rolesgroups/:id', {id:'@id'});
}])	
.service('UsersRepository',['$resource',function($resource){
	return $resource('/admin/users/:id', {id:'@id'});
}])	;
