/**
 * Created by Kaka Hoang Huy on 11/1/2015.
 */

app.controller('ChangeStatusCtrl', ['$scope', '$ionicPopup', 'dataService', function ($scope, $ionicPopup, dataService) {
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
  getStatus();
  $scope.changeStatus = function () {
    var urlCountTask = config.hostServer + 'api/shipper/countTasks';
    dataService.getDataServer(urlCountTask).then(function (rs) {
      $scope.tasks = rs.data;
      console.log($scope.tasks.Actived);
      if ($scope.tasks.Actived > 0) {
        console.log('11111112');
        var content = "You have " + $scope.tasks.Actived + " active task(s)." +
          "You need to finish or send issue to cancel your task first!";
        showAlert("Error", content);
      } else {
        if ($scope.NotActive > 0) {
          var msg = "You have " + $scope.NotActive + " undone task(s)! If you go offline, your task will be remove! Still want to offline?";
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
