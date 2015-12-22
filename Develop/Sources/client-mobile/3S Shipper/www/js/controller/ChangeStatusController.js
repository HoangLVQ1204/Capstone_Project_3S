/**
 * Created by Kaka Hoang Huy on 11/1/2015.
 */

app.controller('ChangeStatusCtrl', ['$rootScope', '$scope', '$ionicPopup', 'dataService', '$ionicPopup', '$ionicLoading', '$state', function ($rootScope, $scope, $ionicPopup, dataService, $ionicPopup, $ionicLoading, $state) {
  $scope.isDisabled = false;
  $scope.tasks = {};
  $scope.status = true;
  var co = 0;
  var getStatus = function(){
    var urlStatus =  config.hostServer + 'api/shipper/status';
    dataService.getDataServer(urlStatus).then(function(stt){
      $scope.status = stt.data;
      console.log(stt.data);
    });
  };

  //==========Notification information//==========
  //grab express success
  $rootScope.$on("shipper:express:order:success", function(event, args) {
    var des = {
      id: 999,
      content: 'You just grab a new orders'
    };
    $scope.showAlert(des);
  });

  //socket new Task shipper:task:newTask
  $scope.$on("shipper:task:newTask", function(event, args){
    console.log("Reload New Task");
    getListOfTask();
  });

  //socket on issue
  $scope.$on("issue:resolve", function (event, args) {
    //console.log("state: ", $stateParams.isCancel);
    // if ($state.current.name == 'app.detail' && $stateParams.isCancel) {
    //   $state.go('app.tasks');
    // }
    //Continue not show this
    console.log("haveIssue:", $rootScope.haveIssue);
    if (!$rootScope.haveIssue) {
      var des = {
         id: 999,
         content: args.content
      };
      console.log("ExpressShowing: ", $rootScope.isExpressShow);
      if(!$rootScope.isExpressShow) {
          $scope.showAlert(des);
      }
    }
  });

  //socket order express canceled
  $scope.$on("shipper:canceled", function(event, args){
    var des = {
        id: 999,
        content: 'Store ' + args.storeid + ' has found another shipper or canceled order'
    }
    $scope.showAlert(des);
  });

  //show alert
  $scope.showAlert = function(des) {
    var alertPopup = $ionicPopup.alert({
      title: 'Information',
      template: des.content
    });
    alertPopup.then(function(res) {
      //reload data
      getListOfTask();
    });
  };

  /*
   * By QuyenNV - 23/10/2015
   * Get all task of shipper with current date and
   * StatusTasks are 'Inactive' and 'Active'
   * */
  function getListOfTask() {
    // if (!$scope.haveIssue) {
    //   $ionicLoading.show({
    //   noBackdrop: false,
    //   template: '<ion-spinner icon="bubbles" class="spinner-balanced"/>'
    //   });
    // }
    var urlBase = config.hostServer + "api/tasks";
    dataService.getDataServer(urlBase)
      .then(function (res) {
      var rs = res.data;
      formatData(rs);
      //Hide IonicLoading without Issue Pending
      // if (!$scope.haveIssue) {
      //   $ionicLoading.hide();
      // }
      },function (error) {
      console.log('Unable to load customer data: ' + error);
      // $ionicLoading.hide();
      })
  }

  /*
   * By QuyenNV - 23/10/2015
   * This function is format data respon from from server
   * @param: rs
   * */
  function formatData(rs) {
    if (undefined !== rs['Pickup'] && rs['Pickup'].length) {
      isIssued(rs['Pickup']);
      $rootScope.pickupTasks = rs['Pickup'];
      $rootScope.badgeCountPick = rs['Pickup'].length;
    } else {
      $rootScope.pickupTasks = [];
      $rootScope.badgeCountPick = 0;
    }
    if (undefined !== rs['Ship'] && rs['Ship'].length) {
      isIssued(rs['Ship']);
      $rootScope.shipTasks = rs['Ship'];
      $rootScope.badgeCountShip = rs['Ship'].length;
    } else {
      $rootScope.shipTasks = [];
      $rootScope.badgeCountShip = 0;
    }
    if (undefined !== rs['Express'] && rs['Express'].length) {
      isIssued(rs['Express']);
      $rootScope.expressTasks = rs['Express'];    
      $rootScope.badgeCountExpress = rs['Express'].length;
    } else {
      $rootScope.expressTasks = [];
      $rootScope.badgeCountExpress = 0;
    }
    if (undefined !== rs['Return'] && rs['Return'].length) {
      isIssued(rs['Return']);
      $rootScope.returnTasks = rs['Return'];
      $rootScope.badgeCountReturn = rs['Return'].length;
    } else {
      $rootScope.returnTasks = [];
      $rootScope.badgeCountReturn = 0;
    }
  }

  /*
   * By QuyenNV - 23/10/2015
   * This function is check task get an issued
   * @param: list
   * */
   function isIssued(list) {
     list.forEach(function(item) {
     //processing
     if (item.statusid == 4) {
       item['iscancel'] = true;
     } else {
       item['iscancel'] = false;
     }
     });
   }
  ////==========End Notification information//==========

  getStatus();
  $scope.changeStatus = function () {
    var urlCountTask = config.hostServer + 'api/shipper/countTasks';
    dataService.getDataServer(urlCountTask).then(function (rs) {
      $scope.tasks = rs.data;
      console.log($scope.tasks.Active);
      if ($scope.tasks.Active > 0) {
        console.log('11111112');
        var content = "You have " + $scope.tasks.Active + " active task(s)." +
          "You need to finish or send issue to cancel your task first!";
        showAlert("Error", content);
      } else {
        if ($scope.Inactive > 0) {
          var msg = "You have " + $scope.Inactive + " undone task(s)! If you go offline, your task will be remove! Still want to offline?";
          showConfirm("Warning", msg).then(function () {
            if (res) {
              sendChangeRequest();
            }
          });
        }
      }
    }, function (er) {
      showAlert("Error", "Fail to load data from server!");
    });
  };
  var sendChangeRequest = function () {
    var urlBase = config.hostServer + 'api/shipper/change-status';
    var data = {
      status: !$scope.status
    };
    dataService.putDataServer(urlBase, data).then(function (rs) {
      showAlert("Success", "Your status has been changed!");
    }, function (er) {
      showAlert("Error", er.data);
    });
  };

  var showConfirm = function (title, content) {
    return $ionicPopup.confirm({
      title: title,
      template: content
    });
  };

  var showAlert = function (title, content) {
    return $ionicPopup.alert({
      title: title,
      template: content
    });
  };
}]);
