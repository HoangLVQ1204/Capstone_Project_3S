/**
 * Created by Nguyen Van Quyen on 10/25/2015.
 */

function ModalService($rootScope, $q, $ionicModal){

  function show(templateUrl, scope, animation){
    var deferred = $q.defer();
    var modalScope = typeof scope !== 'undefined' ? scope : $rootScope.$new();

    $ionicModal.fromTemplateUrl(templateUrl, {
      scope: modalScope,
      animation: animation || 'slide-in-up'
    }).then(function(modal) {
      modalScope.modal = modal;

      modalScope.openModal = function(){
        modalScope.modal.show();
      };

      modalScope.closeModal = function(){
        modalScope.modal.hide();
      };

      modalScope.$on('modal.hidden', function (thisModal){
        thisModal.currentScope.$destroy();
        thisModal.currentScope.modal.remove();
      });

      modalScope.modal.show();

      deferred.resolve(modalScope);
    });

    return deferred.promise;
  }

  return {
    show: show
  };
}

app.factory('genericModalService', ModalService);

