/**
 * Created by Nguyen Van Quyen on 10/25/2015.
 */



function fancySelectDirective($rootScope, $parse, $timeout, genericModalService) {
  return {
    restrict: 'EA',
    require: 'ngModel',
    scope: {
      'items': '='
    },

    link: function(scope, element, attrs, ngModelCtrl) {
      element.addClass('fancy-select');
      // Validate directive attributes.
      if (!attrs.items) {
        throw(new Error('items requires list over which to iterate.'));
      }
      if (!attrs.itemLabel ) {
        throw(new Error('fancySelect requires a itemLabel expression.'));
      }


      var multiSelect 		= scope.$eval(attrs.multiSelect) || false,
        closeOnSelection 	= scope.$eval(attrs.closeOnSelection) || multiSelect ? false : true,
        headerText 			= attrs.headerText || (multiSelect ? 'Select Order' : 'Select Type'),
        templateUrl 		= attrs.itemsTemplateUrl || 'template/fancy-select/fancy-select.html',
        groupBy				= attrs.groupBy || '',
        groupLabelParser 	= attrs.groupLabel ? $parse(attrs.groupLabel) : false,
        itemLabelParser 	= $parse(attrs.itemLabel),
        modalScope;

      function select(){
        var viewValue;
        if(multiSelect){
          //Filter item  which selected
          viewValue = modalScope.selection.selectable.filter(function (item) {
            return item.selected;
          });
          //todo
          //var listVal = [];
          //viewValue.forEach(function(item){
          //  listVal.push({'val': item.val, 'text': item.text, 'selected': item.selected});
          //});
          //viewValue = listVal;
        } else{
          viewValue = modalScope.selection.selected;
        }
        ngModelCtrl.$setViewValue(viewValue);
        ngModelCtrl.$render();
      }

      function showItems(){
        modalScope = $rootScope.$new();
        modalScope.multiSelect = multiSelect;
        modalScope.headerText = headerText;
        modalScope.itemLabel = itemLabelParser;
        modalScope.closeOnSelection = closeOnSelection;
        modalScope.group = groupBy;
        modalScope.groupLabel = groupLabelParser;
        modalScope.select = select;
        modalScope.selection = {
          selectable: scope.items,
          selected: scope.selected
        };

        if(multiSelect && typeof modalScope.selection.selected !== 'undefined' && Array.isArray(modalScope.selection.selected)){
          modalScope.selection.selectable.forEach(function (item){
            delete item.selected;
          });
          modalScope.selection.selected.forEach(function (item){
            var itemIndex = modalScope.selection.selectable.indexOf(item);
            if(itemIndex >= 0){
              modalScope.selection.selectable[itemIndex].selected = true;
            }
          });
        }

        if(closeOnSelection){
          var watchable = multiSelect ? 'selection.selectable' : 'selection.selected';
          modalScope.$watch(watchable, function (nv, ov){
            if(nv !== ov){
              select();
              $timeout(modalScope.closeModal, 0);
            }
          }, true);
        }

        genericModalService.show(templateUrl, modalScope, 'slide-in-right');
      }

      ngModelCtrl.$render = function() {
        scope.selected = ngModelCtrl.$viewValue;
      };

      element.on('click', showItems);
    }
  };
}

function fancySelectTemplate ($templateCache) {
  $templateCache.put('template/fancy-select/fancy-select.html',
    '<ion-modal-view class="fancy-select-modal">' +
    '	<ion-header-bar align-title="center" class="bar-positive">' +
    '		<button class="button button-clear button-icon ion-arrow-left-c" ng-click="closeModal()"></button>' +
    '		<h1 class="title">{{headerText}}</h1>' +
    '		<button class="button button-clear button-icon ion-checkmark-round" ng-if="!closeOnSelection" ng-click="select(); closeModal();"></button>' +
    '	</ion-header-bar>' +
    '	<ion-content>' +
    '		<div ng-if="group">' +
    '			<div class="list" ng-if="multiSelect" ng-repeat="(key, value) in selection.selectable | groupBy : group">' +
    '				<ion-item ng-if="groupLabel" class="item-divider">{{groupLabel(value[0])}}</ion-item>' +
    '				<ion-checkbox ng-repeat="item in value" ng-model="item.selected">{{itemLabel(item)}}</ion-checkbox>' +
    '			</div>' +
    '			<div class="list" ng-if="!multiSelect" ng-repeat="(key, value) in selection.selectable | groupBy : group">' +
    '				<ion-item ng-if="groupLabel" class="item-divider">{{groupLabel(value[0])}}</ion-item>' +
    '				<ion-radio ng-repeat="item in value" ng-model="selection.selected" ng-value="item" name="fancy-select">{{itemLabel(item)}}</ion-radio>' +
    '			</div>' +
    '		</div>' +
    '		<div ng-if="!group">' +
    '			<div class="list">' +
    '				<ion-checkbox ng-if="multiSelect" ng-repeat="item in selection.selectable" ng-model="item.selected">{{itemLabel(item)}}</ion-checkbox>' +
    '				<ion-radio ng-if="!multiSelect" ng-repeat="item in selection.selectable" ng-model="selection.selected" ng-value="item" name="fancy-select">{{itemLabel(item)}}</ion-radio>' +
    '			</div>' +
    '		</div>' +
    '	</ion-content>' +
    '</ion-modal-view>'
  );
}

app.run(fancySelectTemplate)

  .directive('fancySelect', fancySelectDirective);
