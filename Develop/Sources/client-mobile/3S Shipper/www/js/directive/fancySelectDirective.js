
/*
 * By QuyenNV - 23/10/2015
 *
 * Create fancy select directive
 *
 * */
app.directive('fancySelect',[
  '$ionicModal',
  function($ionicModal) {
    return {
      /* Only use as <fancy-select> tag */
      restrict : 'E',

      /* Our template */
      templateUrl: 'fancy-select.html',

      /* Attributes to set */
      scope: {
        'items'        : '=', /* Items list is mandatory */
        'text'         : '=', /* Displayed text is mandatory */
        'value'        : '=', /* Selected value binding is mandatory */
        'callback'     : '&'
      },

      link: function (scope, element, attrs) {

        /* Default values */
        scope.multiSelect   = attrs.multiSelect === 'true' ? true : false;
        scope.allowEmpty    = attrs.allowEmpty === 'false' ? false : true;

        /* Header used in ion-header-bar */
        scope.headerText    = attrs.headerText || '';

        /* Text displayed on label */
        // scope.text          = attrs.text || '';
        scope.defaultText   = scope.text || '';

        $ionicModal.fromTemplateUrl(
          'fancy-select-items.html',
          {'scope': scope}
        ).then(function(modal) {
            scope.modal = modal;
          });

        /* Validate selection from header bar */
        scope.validate = function (event) {
          // Construct selected values and selected text
          if (scope.multiSelect == true) {

            // Clear values
            scope.value = '';
            scope.text = '';

            // Loop on items
            scope.items.forEach(function(item){
              if (item.checked) {
                scope.value = scope.value + item.id+';';
                scope.text = scope.text + item.text+', ';
              }
            });

            // Remove trailing comma
            scope.value = scope.value.substr(0,scope.value.length - 1);
            scope.text = scope.text.substr(0,scope.text.length - 2);
          }

          // Select first value if not nullable
          if (typeof scope.value == 'undefined' || scope.value == '' || scope.value == null ) {
            if (scope.allowEmpty == false) {
              if (scope.multiSelect == true) {
                scope.value = scope.items[0].id;
                scope.text = scope.items[0].text;
              } else {
                scope.value = scope.items[0].categoryID;
                scope.text = scope.items[0].categoryName;
              }

              // Check for multi select
              scope.items[0].checked = true;
            } else {
              scope.text = scope.defaultText;
            }
          }

          // Hide modal
          scope.hideItems();

          // Execute callback function
          if (typeof scope.callback == 'function') {
            scope.callback (scope.value);
          }
        }

        /* Show list */
        scope.showItems = function (event) {
          event.preventDefault();
          scope.modal.show();
        }

        /* Hide list */
        scope.hideItems = function () {
          scope.modal.hide();
        }

        /* Destroy modal */
        scope.$on('$destroy', function() {
          scope.modal.remove();
        });

        /* Validate single with data */
        scope.validateSingle = function (item) {

          // Set selected text
          scope.text = item.categoryName;

          // Set selected value
          scope.value = item.categoryID;

          // Hide items
          scope.hideItems();

          // Execute callback function
          if (typeof scope.callback == 'function') {
            scope.callback (scope.value);
          }
        }
      }
    };
  }
]);
