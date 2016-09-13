(function() {

  angular
    .module('commission', [])
  angular
    .module('commission')
    .factory('MembersFactory', MembersFactory)
    .factory('urlBuilderFactory', urlBuilderFactory)
    .controller('ComMembersController', ComMembersController);
    
  MembersFactory.$inject = ['$http', '$q'];
  ComMembersController.$inject = ['$scope', 'MembersFactory', 'urlBuilderFactory'];

  function ComMembersController($scope, MembersFactory, urlBuilderFactory) {
    
    var vm = this;
    vm.organization = "";
    vm.spinner = 0;
    vm.member = {};
    vm.member.list = [];
    vm.member.initiate = initiateNewMember;
    vm.member.saveListAsDraft = saveListAsDraft;
    vm.member.recoverListDraft = recoverListDraft;
    vm.member.getList = getMemberList;
    vm.member.saveList = saveList;
    vm.member.remove = removeMember;
    vm.member.moveUp = moveUpMember;
    vm.member.moveDown = moveDownMember;    
    vm.getOrganizationObj = getOrganizationObject;
    
    function getOrganizationObject (organizationId) {
      var OrganizationMembersUrl = urlBuilderFactory.getOrganization(vm.organization);
      MembersFactory.getOrganization(OrganizationMembersUrl)
        .then(
          function(data) {
            vm.OrganizationName = data.name;
          } 
        )
    }
    
    function initiateNewMember() {
      MembersFactory.initiateNewMember()
       .then(
          function(data) {
            vm.member.list.push(data);
            console.log('member addet to members', vm.member.list);
          }
        );
    }
    
    function removeMember(index) {
      vm.member.list.splice(index, 1);
    }
    
    function moveUpMember(index) {
     var obj = vm.member.list[index];
     vm.member.list.splice(index, 1);
     vm.member.list.splice(index - 1, 0, obj);
    }
    
    function moveDownMember(index) {
     var obj = vm.member.list[index];
     vm.member.list.splice(index, 1);
     vm.member.list.splice(index + 1, 0, obj);
    }
    
    function saveListAsDraft() {
      var obj = {"members": angular.toJson(vm.member.list)};
      obj = JSON.stringify(obj);
      localStorage.setItem('memberListDraft', obj);
      alert("saved member list as draft");
    }
    
    function recoverListDraft() {
      var obj = localStorage.getItem('memberListDraft');
      obj = angular.fromJson(obj).members;
      if (obj !== null) {
        vm.member.list = JSON.parse(obj);
      }
    }
    
    function getMemberList(organizationId) {
      vm.spinner = 1;
      var OrganizationMembersUrl = urlBuilderFactory.getMembers(vm.organization);
      MembersFactory.getMemberList(OrganizationMembersUrl)
       .then(
          function(data) {
            vm.member.list = data;
            vm.spinner = 0;
          }
        )
    }
    
    function saveList(organizationId) {
      vm.spinner = 1;
      var OrganizationMembersUrl = urlBuilderFactory.saveMembers(vm.organization, vm.member.list);    
      MembersFactory.saveMemberList(OrganizationMembersUrl)
        .then(
          function(data) {
            vm.member.list = data;
            vm.spinner = 0; 
          }
        )
    }
  }
  
  function MembersFactory($http, $q) {
    
    var service = {
      "initiateNewMember": initiateNewMember,
      "getMemberList": getMemberList,
      "saveMemberList": saveMemberList,
      "getOrganization": getOrganization
    };
    
    return service;
    
    function getMemberList(serviceEndpoint) {
      var url = serviceEndpoint;
      var deferred = $q.defer();
      $http.get(url)
        .success(function (data) {
          deferred.resolve(angular.fromJson(data.members));
          console.log(data);
        }).error(function (msg, code) {
          deferred.reject(msg);
          console.log(msg, code);
        });
      return deferred.promise;
    }
      
    function saveMemberList(serviceEndpoint) {
      var url = serviceEndpoint;
      var deferred = $q.defer();
      $http.post(url)
        .success(function (data) {
          deferred.resolve(angular.fromJson(data.data).members);
          console.log(data);
        }).error(function (msg, code) {
          deferred.reject(msg);
          console.log(msg, code);
        });
      return deferred.promise;
    }
    
    function initiateNewMember() {
      var deferred = $q.defer();
      var MemberObject = {
        "firstName": "t",
        "lastName": "a",
        "memberType": "member",
        "memberDescription": {
          "de": "de",
          "fr": "fr"
        },
        "female": undefined
      };
        deferred.resolve(MemberObject);
      return deferred.promise;
    }
    
    function getOrganization(serviceEndpoint) {
      var url = serviceEndpoint;
      var deferred = $q.defer();
        $http.post(url)
          .success(function (data) {
            deferred.resolve(data);
            console.log(data);
          }).error(function (msg, code) {
            deferred.reject(msg);
            console.log(msg, code);
          });
      return deferred.promise;
    }

  }
  
  if (typeof Liferay !== 'undefined') {
    var serviceConfig = {
      "baseUrl": Liferay.ThemeDisplay.getCDNBaseURL(),
      "companyId": Liferay.ThemeDisplay.getCompanyId(),
      "organizationClassName": "com.liferay.portal.model.Organization",
      "tableName": "CUSTOM_FIELDS",
      "columnName": 'commission_members',
      "cmdGetJsonData": encodeURIComponent('{"/expandovalue/get-json-data":{}}'),
      "cmdAddValue": encodeURIComponent('{"/expandovalue/add-value":{}}'),
      "cmdGetOrganization": encodeURIComponent('{"/organization/get-organization":{}}'),
      "authToken": Liferay.authToken
    }
  } else {
    var serviceConfig = {
      "baseUrl": "vs.test.ch",
      "companyId": "nonprod",
      "organizationClassName": "com.liferay.portal.model.Organization",
      "tableName": "CUSTOM_FIELDS",
      "columnName": 'commission_members',
      "cmdGetJsonData": encodeURIComponent('{"/expandovalue/get-json-data":{}}'),
      "cmdAddValue": encodeURIComponent('{"/expandovalue/add-value":{}}'),
      "cmdGetOrganization": encodeURIComponent('{"/organization/get-organization":{}}'),
      "authToken": "testtoken"
    }
  }
  
  
  
  
  
  function urlBuilderFactory () {
    
    var service = {
      "saveMembers": saveMembers,
      "getMembers": getMembers,
      "getOrganization": getOrganization
    };
    
    return service;
    
    
    function saveMembers(orgId, data) {
      var url = [
        serviceConfig.baseUrl,
        '/api/jsonws/invoke',
        '?companyId='+serviceConfig.companyId,
        '&className='+serviceConfig.organizationClassName,
        '&tableName='+serviceConfig.tableName,
        '&columnName='+serviceConfig.columnName,
        '&classPK='+orgId,
        '&cmd='+serviceConfig.cmdAddValue,
        '&data='+ encodeURIComponent(angular.toJson({members: data})),
        '&p_auth='+serviceConfig.authToken
      ].join('');
      return url;
    }
    
    function getMembers (orgId) {
      var url = [
        serviceConfig.baseUrl,
        '/api/jsonws/invoke',
        '?companyId='+serviceConfig.companyId,
        '&className='+serviceConfig.organizationClassName,
        '&tableName='+serviceConfig.tableName,
        '&columnName='+serviceConfig.columnName,
        '&classPK='+orgId,
        '&cmd='+serviceConfig.cmdGetJsonData,
        '&p_auth='+serviceConfig.authToken
      ].join('');
      return url;
    }
    
    function getOrganization (orgId) {
      var url = [
        serviceConfig.baseUrl,
        '/api/jsonws/invoke',
        '&organizationId='+orgId,
        '&cmd='+serviceConfig.cmdGetOrganization,
        '&p_auth='+serviceConfig.authToken
      ].join('');
      return url;
    }
  }

})();
