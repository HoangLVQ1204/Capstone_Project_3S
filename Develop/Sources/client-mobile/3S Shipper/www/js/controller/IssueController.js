/**
 * Created by Kaka Hoang Huy on 9/30/2015.
 */
app.controller('IssueCtrl',['$scope','$ionicPopup', 'dataService', '$ionicLoading', '$timeout', 'socketShipper', function ($scope, $ionicPopup, dataFactory, $ionicLoading, $timeout, socketShipper) {

  //Get All Task of shipper
  $scope.isSend = false;
  $scope.haveIssue = false;
  getAllTaskOfShipper();

  //socket on issue
  $scope.$on("issue:resolve", function (event, args) {
    // if (args.type !== 1 && args.type !== 2 && args.type !== 3 && args.type !== 6 && args.type !== 8) {
    //   var alertPopup = $ionicPopup.alert({
    //     title: 'Information',
    //     template: 'Your Task is resolved'
    //   });
    //   alertPopup.then(function(res) {
    //     console.log('You got it');
    //   });
    // }
    //Continue not show this
    if (!$scope.haveIssue) {
      var alertPopup = $ionicPopup.alert({
        title: 'Information',
        template: 'Your Task is resolved'
      });
      alertPopup.then(function(res) {
        console.log('You got it');
      });
    }
  });

  //socket order express canceled
  $scope.$on("shipper:canceled", function(event, args){
    console.log('Shipper: canceled:', args);
    var des = {
        id: 999,
        content: 'Store ' + args.storeid + ' has found a shipper or canceled order'
    };
    $scope.showAlert(des);
  });

  /*
   * By QuyenNV - 23/10/2015
   * This function get all task of shipper
   * */
  function getAllTaskOfShipper() {
    //get all tasks of shipper
    var urlBase = config.hostServer + "api/tasks";
    dataFactory.getDataServer(urlBase)
      .then(function (res) {
        var rs = res.data;
        formatData(rs);

      }, function (error) {
        console.log('Unable to load customer data: ' + error);
      });
  }

  /*
   * By QuyenNV - 23/10/2015
   *
   * This function is format data respon from from server
   * @param: rs
   * */
  function formatData(rs) {
    $scope.listOrderActive = [];
    var listOrderInactive = [];
    var listShipping = [];
    var listGoodIsBroken = [];
    if (undefined !== rs['Pickup'] && rs['Pickup'].length) {
      rs['Pickup'].forEach(function(item) {
        //statusid = 2, Active status of Task
        if (item.isPending == false && item.statusid == 2) {
          $scope.listOrderActive.push({
            'val': item.orderid,
            'text': item.orderid
          });
        }
        listOrderInactive.push({
          'val': item.orderid,
          'text': item.orderid
        });
      });
    }
    if (undefined !== rs['Ship'] && rs['Ship'].length) {
      console.log('Ship', rs['Ship']);
      rs['Ship'].forEach(function(item) {
        //statusid = 2, Active status of task
        if (item.isPending == false && item.statusid == 2) {
          $scope.listOrderActive.push({
            'val': item.orderid,
            'text': item.orderid
          });
        }
        if (item.orderstatusid == 5) {
          listGoodIsBroken.push({
            'val': item.orderid,
            'text': item.orderid
          })
        }
        listOrderInactive.push({
          'val': item.orderid,
          'text': item.orderid
        });
        listShipping.push({
          'val': item.orderid,
          'text': item.orderid
        })

      });
    }
    if (undefined !== rs['Express'] && rs['Express'].length) {
      console.log('Express', rs['Express']);
      rs['Express'].forEach(function(item) {
        //statusid = 2, Active status of task
        if (item.isPending == false && item.statusid == 2) {
          $scope.listOrderActive.push({
            'val': item.orderid,
            'text': item.orderid
          });
        }

        if (item.orderstatusid == 5) {
          listGoodIsBroken.push({
            'val': item.orderid,
            'text': item.orderid
          })
        }

        listOrderInactive.push({
          'val': item.orderid,
          'text': item.orderid
        });
      });
    }
    if (undefined !== rs['Return'] && rs['Return'].length) {
      console.log('return', rs['Return']);
      rs['Return'].forEach(function(item) {
        //statusid = 2, Active status of task
        if (item.isPending == false && item.statusid == 2) {
          $scope.listOrderActive.push({
            'val': item.orderid,
            'text': item.orderid
          });
        }

        if (item.orderstatusid == 6) {
          listGoodIsBroken.push({
            'val': item.orderid,
            'text': item.orderid
          })
        }

        listOrderInactive.push({
          'val': item.orderid,
          'text': item.orderid
        });
      });
    }
    console.log("listOrderActive", $scope.listOrderActive);
    //Fill to "Order" dropdown list
    $scope.selectable = listOrderInactive;
    //Fill to "Order" dropdown list
    $scope.listOrderShipping = listShipping;
    //Fill to cancel (goood is broken)
    $scope.listOrderBroken = listGoodIsBroken;
  }

  //Fill to "Type" dropdown list
  $scope.issueCategories = [
    {categoryID: '1', categoryName: 'Pending' },
    {categoryID: '2', categoryName: 'Cancel' }
  ];
  $scope.listReasons = [
    {typeID: '1', categoryID: '1', typeName: 'Traffic jam' },
    {typeID: '2', categoryID: '1', typeName: 'Vehicle' },
    {typeID: '3', categoryID: '1', typeName: 'Accident' },
    {typeID: '6', categoryID: '1', typeName: 'Other' },
    {typeID: '4', categoryID: '2', typeName: 'Goods is broken' },
    {typeID: '5', categoryID: '2', typeName: 'Cannot contact with customer' }
  //{typeID: '7', categoryID: '2', typeName: 'Other' }
  ];
  $scope.pendingReasons = [
    {typeID: '1', categoryID: '1', typeName: 'Traffic jam' },
    {typeID: '2', categoryID: '1', typeName: 'Vehicle' },
    {typeID: '3', categoryID: '1', typeName: 'Accident' },
    {typeID: '6', categoryID: '1', typeName: 'Other' }
  ];
  $scope.cancelReasons = [
    {typeID: '4', categoryID: '2', typeName: 'Goods is broken' },
    {typeID: '5', categoryID: '2', typeName: 'Cannot contact with customer' }
  ];

  //Item lable display
  $scope.parseMulti = function(items){
    if(items){
      return items.map(function(item){ return item.text; }).join(', ');
    }
  };

  //START Show IonicLoading
  $scope.showLoading = function(){
    $ionicLoading.show({
      scope: $scope,
      templateUrl: 'loading.html',
      noBackdrop: false,
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
      $scope.isSend = false;
      if (des.id === 1) {
        $scope.btnContinue = false;
        $scope.haveIssue = true;
        $scope.showLoading();
      } else {
        $ionicLoading.hide();
      }
      if (des.id == 3 || des.id == 5) {
        // Shipper continue
        socketShipper.updateHaveIssue(false);
      }
    });
  };
  //END Alert Dialog

  /*
   * By QuyenNV - 1/11/2015
   * ChangePending of order
   * */
  $scope.changeIsPendingOrderIssue = function (issueId) {

    //disable the button on click
    $scope.btnContinue = true;

    //Change ispending of Task
    var data = {'issueId': issueId};
    var urlBase = config.hostServer + "api/changeIsPendingOrder";
    dataFactory.putDataServer(urlBase, data)
      .then(function (res) {
        var rs = res.data;
        $ionicLoading.hide();
        $scope.showAlert(rs);

      }, function (error) {
        console.log('Unable to load customer data: ' + error);
      })
  };

  /*
   * By QuyenNV - 24/10/2015
   *
   * This function submit
   * @param: issue
   * */
  $scope.submitData = function (issue) {
      $scope.isSend = true;

      //Validation
      if ( typeof issue === "undefined" || issue.category === null || typeof issue.category === "undefined") {
        var msg1 = {
          id: 999,
          content: 'Please choose Category'
        }
        $scope.showAlert(msg1);
      } else if (issue.type === null || typeof issue.type === "undefined") {
        var msg2 = {
          id: 999,
          content: 'Please choose Reason'
        }
        $scope.showAlert(msg2);
      } else if (issue.category.categoryID != 1 && typeof issue.issuedOrder === "undefined") {
        var msg3 = {
          id: 999,
          content: 'Please choose Order'
        }
        $scope.showAlert(msg3);
      } else if (typeof issue.description === "undefined" || issue.description === "") {
        var msg4 = {
          id: 999,
          content: 'Please write Content'
        }
        $scope.showAlert(msg4);
      } else {

        //post an API
        var listOrders = [];

        //Pending: All order will sent
        if (issue.category.categoryID == 1) {

          //$scope.listOrders
          console.log("listOrderActiveAAAAA", $scope.listOrderActive);
          listOrders = $scope.listOrderActive;
          if (listOrders.length == 0) {
            var msg5 = {
              id: 999,
              content: "You don't have task is actived"
            }
            $scope.showAlert(msg5);
          }
        } else {

          //Cancel
          listOrders = issue.issuedOrder;
          if (listOrders.length == 0) {
            var msg6 = {
              id: 999,
              content: "You don't have task"
            }
            $scope.showAlert(msg6);
          }
        }
        if (listOrders.length > 0) {

          //send issue
          //List issuedOrder
          var listPostOrders = [];
          listOrders.forEach(function(item){
            listPostOrders.push(item.text);
          });

          //New Issue
          var newIssue = {};
          newIssue.typeid = issue.type.typeID;
          newIssue.description = issue.description;
          var data = [];

          data.push({
            'orders': listPostOrders,
            'issue': newIssue,
            'categoryissue': issue.category.categoryID
          });

          var urlCreateBase = config.hostServer + 'api/issue';
          dataFactory.postDataServer(urlCreateBase, data)
            .then(function (rs) {
              rs = rs.data
              $ionicPopup.alert({
                title: 'Success',
                content: 'Your Issue is sent to Admin. Wait for Admin to solve.'
              }).then(function(res) {
                $scope.isSend = false;

                //Pass to function changeIsPendingOrder
                $scope.issueId = rs[0].issueid;

                //1 is Pending
                if (rs[0].catissue == 1) {
                  $scope.haveIssue = true;
                  $scope.btnContinue = false;
                  $scope.showLoading();
                }

                //TODO Del order choosed in issuedOrder array for 'Cancel Order' cause
                //var delIndex;
                //issue.issuedOrder.forEach(function(item) {
                //  $scope.selectable.forEach(function(i) {
                //    if (i.val === item.val) {
                //      delIndex = $scope.selectable.indexOf(i);
                //      if (delIndex != -1) {
                //        $scope.selectable.splice(delIndex, 1);
                //      }
                //    }
                //  });
                //});

                //reset values
                issue.description = '';
                issue.category = null;
                issue.type = null;
                issue.issuedOrder = [];
              });
            });
        }
      }
  }
}]);


