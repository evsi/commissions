<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular.min.js"></script>
<h2>Todo</h2>

<div ng-app="commission">
<div ng-controller="ComMembersController as vm">
  <input ng-model="vm.organization"><button type="button" ng-click="vm.member.getList(vm.organization)">GetList</button>
  <div ng-show="vm.spinner" class="large lv-progress"><div>Loading…</div></div>
  
    <div ng-hide="vm.spinner">
      <ul>
        <li ng-repeat="member in vm.member.list">
          <form class="form-inline">
            <label for="member_firstName">Firstname:</label>
            <input id="member_firstName" type="text" ng-model="member.firstName">
            <label for="member_lastName">Lastname:</label>
            <input id="member_lastName" type="text" ng-model="member.lastName">
            <label for="member_type">Type:</label>
            <input id="member_description" type="text" ng-model="member.memberType">
            <label for="member_description_de">Description de:</label>
            <input id="member_description_de" type="text" ng-model="member.memberDescription.de">
            <label for="member_description_fr">Description de:</label>
            <input id="member_description_fr" type="text" ng-model="member.memberDescription.fr">

            <button type="button" ng-click="vm.member.remove($index)">x</button>
            <button type="button" ng-click="vm.member.moveUp($index)">up</button>
            <button type="button" ng-click="vm.member.moveDown($index)">down</button>

          </form>
        </li>
      </ul>
      <div>
        <button type="button" ng-click="vm.member.initiate()">add new member</button>
        <button type="button" ng-click="vm.member.saveListAsDraft()">save as draft (local)</button>
        <button type="button" ng-click="vm.member.recoverListDraft()">recover draft (local)</button>
        <button type="button" ng-click="vm.member.saveList(vm.organization)">saveList</button>
      </div>
    </div>
  
</div>
</div>
<script src="https://raw.githubusercontent.com/evsi/commissions/master/commissions.js"></script>
