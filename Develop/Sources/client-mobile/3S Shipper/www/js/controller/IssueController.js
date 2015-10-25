/**
 * Created by Kaka Hoang Huy on 9/30/2015.
 */
app.controller('IssueCtrl',['$scope','$ionicPopup' , 'dataService', 'mySharedService', function ($scope, $ionicPopup, dataFactory, mySharedService) {

  if (undefined !== mySharedService.message && mySharedService.message !== '') {

    formatData(mySharedService.message);
    //var rs = mySharedService.message;

  } else {
    console.log('save message sharing');
    getDataFromServer();
  }

/*
 * By QuyenNV - 23/10/2015
 *
 * This function is call API
 *
 * */
  function getDataFromServer() {
    var urlBase = 'http://localhost:3000/api/tasks';
    dataFactory.getDataServer(urlBase)
      .success(function (rs) {
        mySharedService.prepForBroadcast(rs);
        formatData(rs);
      })
      .error(function (error) {
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
    var listOrders = [];
    if (undefined !== rs['Pickup'] && rs['Pickup'].length) {
      rs['Pickup'].forEach(function(item) {
        listOrders.push({
          'id': item.orderid,
          'text': item.orderid,
          'statusId': item.statusid,
          'statusName': item.statusname,
          'pickupAdd': item.pickupaddress,
          'deliveryAdd': item.deliveryaddress,
          'checked': true
        });
      });
    }
    if (undefined !== rs['Ship'] && rs['Ship'].length) {
      rs['Ship'].forEach(function(item) {
        listOrders.push({
          'id': item.orderid,
          'text': item.orderid,
          'statusId': item.statusid,
          'statusName': item.statusname,
          'pickupAdd': item.pickupaddress,
          'deliveryAdd': item.deliveryaddress,
          'checked': false
        });
      });
    }

    if (undefined !== rs['Express'] && rs['Express'].length) {
      rs['Express'].forEach(function(item) {
        listOrders.push({
          'id': item.orderid,
          'text': item.orderid,
          'statusId': item.statusid,
          'statusName': item.statusname,
          'pickupAdd': item.pickupaddress,
          'deliveryAdd': item.deliveryaddress,
          'checked': true
        });
      });
    }
    //Fill to "Order" dropdown list
    $scope.orders = listOrders;
  }

  //Fill to "Type" dropdown list
  $scope.issueCategories = [
    {categoryID: "1", categoryName: 'Accident or Personal working' },
    {categoryID: "2", categoryName: 'Goods is broken' }
  ];
  $scope.types_text = 'Choose Type of Issue';
  $scope.orders_text = 'Order get an Issue';
  $scope.val =  {single: null, multiple: null};


  //test new fancy box
  $scope.selectable = [{"val":"1","text":"Peterman"},{"val":"2","text":"Sessa"},{"val":"3","text":"Cox"}];

  $scope.parseMulti = function(items){
    if(items){
      return items.map(function(item){ return item.text; }).join(', ');
    }
  };


  /*
   * By QuyenNV - 24/10/2015
   *
   * This function submit
   * @param:
   * */
  $scope.submitData = function (issue) {
    //Validation
    //if (undefined !== rs['Express'] && rs['Express'].length) {
    //if (undefined === $scope.val.single || $scope.val.single == null) {
    //    //$ionicPopup.alert({
    //    //  title: 'Information',
    //    //  content: 'Type is not empty !'
    //    //}).then(function(res) {
    //    //  console.log('Type Alert Box');
    //    //});
    //} else if (undefined === $scope.val.multiple || $scope.val.multiple == null) {
    //  $ionicPopup.alert({
    //    title: 'Information',
    //    content: 'Order not empty !'
    //  }).then(function(res) {
    //    console.log('Order Alert Box');
    //  });
    //} else if (undefined === issue || issue === '') {
    //  $ionicPopup.alert({
    //    title: 'Information',
    //    content: 'Content is not Empty !'
    //  }).then(function(res) {
    //    console.log('Type Alert Box');
    //  });
    //} else {
      //post an API
      var urlCreateBase = 'http://localhost:3000/api/issue';
      dataFactory.postDataServer(urlCreateBase, issue)
        .success(function (rs) {
          console.log('1');
        })
        .error(function (error) {
          console.log('Unable to load customer data: ' + error);
        });
    //}
  }

}]);


