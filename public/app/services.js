'use strict';

/* Services */
angular.module('wasab.services', [])
.value('version', '0.1')
.factory('WasabRestBuilder',['$resource', function($resource){
	return {
		api : function(resourceName, new_options){
			var options = {
					byId:{url:'/admin/'+resourceName+'/get/:id', params:{id:'@id'}},
					query:{url:'/admin/'+resourceName+'/list', isArray:true},
					create:{url:'/admin/'+resourceName+'/create', method:'POST'},
					update:{url:'/admin/'+resourceName+'/update', method:'POST'},
					delete:{url:'/admin/'+resourceName+'/delete/:id', params:{id:'@id'}, method:'POST'}
				};
			var res = $resource('/admin/'+resourceName+'/:id', {id:'@id'}, angular.extend(options, new_options || {}));
			return res;
		}
	}
}])
.service('ApplicationsRepository',['WasabRestBuilder',function(WasabRestBuilder){
	return WasabRestBuilder.api('applications');
}])
.service('GroupsRepository',['WasabRestBuilder',function(WasabRestBuilder){
	return WasabRestBuilder.api("groups", 
								{queryByAppId:{url:'/admin/groups/application/:appId',params:{appId:'@appId'}, isArray:true}});
}])
.service('OperationsRepository',['WasabRestBuilder',function(WasabRestBuilder){
	return WasabRestBuilder.api("operations",
								{queryByAppId:{url:'/admin/operations/application/:appId',params:{appId:'@appId'}, isArray:true}});
}])
.service('RolesRepository',['WasabRestBuilder',function(WasabRestBuilder){
	return WasabRestBuilder.api('roles',
								{queryByAppId:{url:'/admin/roles/application/:appId',params:{appId:'@appId'}, isArray:true}});
}])
.service('RolesGroupsRepository',['WasabRestBuilder',function(WasabRestBuilder){
	return WasabRestBuilder.api('rolesgroups');
}])	
.service('UsersRepository',['WasabRestBuilder',function(WasabRestBuilder){
	return WasabRestBuilder.api('users');
}])	;
