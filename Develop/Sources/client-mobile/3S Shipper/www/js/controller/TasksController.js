/**
 * Created by Nguyen Van Quyen on 10/6/2015.
 */
app.controller('TasksCtrl', ['$scope', 'dataService', '$ionicLoading', '$ionicPopup', function($scope, dataFactory, $ionicLoading, $ionicPopup) {

  console.log('reload data at TaskController');
  getAllTaskBeIssued();
  getAllTaskCancel();

  //Select tab for find bestway screen
  $scope.tabSelected = function(tab) {
    $scope.tabParam = tab;
    if (typeof $scope.tabParam === "undefined" || $scope.tabParam === "") {
      $scope.tabParam = "all";
    }
  };

  //START Show IonicLoading
  $scope.isBackdropShowing = false;
  $scope.show = function(){
    $ionicLoading.show({
      templateUrl: 'loading.html',
      scope: $scope
    });
  };
  //END Show IonicLoading

  //START Alert Dialog
  $scope.showAlert = function(des) {
    var alertPopup = $ionicPopup.alert({
      title: 'Information',
      template: des.content
    });
    alertPopup.then(function(res) {
      if (des.id === 1) {
        $scope.show();
      } else {
        $ionicLoading.hide();
      }
    });
  };
  //END Alert Dialog

  /*
   * By QuyenNV - 1/11/2015
   * Get All Task of Shipper be issued(issue.isResolved = false or order.isPending = true).
   * To check to show 'continue screen'
   * */
  function getAllTaskBeIssued() {
    //get task be an issue
    var urlTaskBase = config.hostServer + "api/shipper/getTaskBeIssuePending";
    dataFactory.getDataServer(urlTaskBase)
      .success(function(rs){
        if (rs !== "null" || typeof rs !== "undefined") {
          for ( var property in rs ) {
            $scope.issueId = property;
          }
          if (typeof $scope.issueId !== "undefined") {
            //show ionicLoading
            $scope.show();
          }
        } else {
          //hide ionicLoading
          $ionicLoading.hide();
        }
      })
      .error(function(error) {
        console.log('Unable to load customer data: ' + error);
      });
  }

  /*
   * By QuyenNV - 1/11/2015
   * ChangePending of order
   * */
  $scope.changeIsPending = function (issueId) {
      //Change ispending of Task
    var data = {'issueId': issueId};
      var urlBase = config.hostServer + "api/changeIsPendingOrder";
        dataFactory.putDataServer(urlBase, data)
        .success(function (rs) {
          $ionicLoading.hide();
          $scope.showAlert(rs);
        })
        .error(function (error) {
          console.log('Unable to load customer data: ' + error);
        });
    }

  /*
   * By QuyenNV - 23/10/2015
   * Get all task have category of issue = cancel and
   * this issue not accept(isResolved=false).
   * So status of task also 'Inactive' and 'Active'
   * */
  function getAllTaskCancel() {
    $ionicLoading.show({
      //duration: 500,
      noBackdrop: false,
      template: '<ion-spinner icon="bubbles" class="custom-icon"/>'
    });
    var urlBaseCancel = config.hostServer + "api/getAllTaskCancel";
    dataFactory.getDataServer(urlBaseCancel)
      .success(function (rs) {
        $scope.listTaskIssueCancel = rs;
        getListOfTask();
        $ionicLoading.hide();
      })
      .error(function (error) {
        console.log('Unable to load customer data: ' + error);
      });
  }

  /*
   * By QuyenNV - 23/10/2015
   * Get all task of shipper with current date and
   * StatusTasks are 'Inactive' and 'Active'
   * */
  function getListOfTask() {
    var urlBase = config.hostServer + "api/tasks";
    dataFactory.getDataServer(urlBase)
      .success(function (rs) {
        formatData(rs);
      })
      .error(function (error) {
        console.log('Unable to load customer data: ' + error);
      });
  }

  /*
   * By QuyenNV - 23/10/2015
   * This function is format data respon from from server
   * @param: rs
   * */
  function formatData(rs) {
    if (undefined !== rs['Pickup'] && rs['Pickup'].length) {
      isIssued(rs['Pickup']);
      $scope.pickupTasks = rs['Pickup'];
      $scope.badgeCountPick = rs['Pickup'].length;
    } else {
      $scope.pickupTasks = [];
      $scope.badgeCountPick = 0;
    }
    if (undefined !== rs['Ship'] && rs['Ship'].length) {
      isIssued(rs['Ship']);
      $scope.shipTasks = rs['Ship'];
      $scope.badgeCountShip = rs['Ship'].length;
    } else {
      $scope.shipTasks = [];
      $scope.badgeCountShip = 0;
    }
    if (undefined !== rs['Express'] && rs['Express'].length) {
      isIssued(rs['Express']);
      $scope.expressTasks = rs['Express'];
      $scope.badgeCountExpress = rs['Express'].length;
    } else {
      $scope.expressTasks = [];
      $scope.badgeCountExpress = 0;
    }
    if (undefined !== rs['Return'] && rs['Return'].length) {
      isIssued(rs['Return']);
      $scope.returnTasks = rs['Return'];
      $scope.badgeCountReturn = rs['Return'].length;
    } else {
      $scope.returnTasks = [];
      $scope.badgeCountReturn = 0;
    }
  }

  /*
   * By QuyenNV - 23/10/2015
   * This function is check task get an issued
   * @param: list
   * */
   function isIssued(list) {
       list.forEach(function(item) {
         if (undefined !== $scope.listTaskIssueCancel) {
           var indexVal = $scope.listTaskIssueCancel.indexOf(item.taskid);
           if (indexVal >= 0) {
             item['iscancel'] = true;
           } else {
             item['iscancel'] = false;
           }
         } else {
           item['iscancel'] = false;
         }
       });
   }
}]);
