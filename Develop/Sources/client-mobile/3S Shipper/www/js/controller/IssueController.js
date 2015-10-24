/**
 * Created by Kaka Hoang Huy on 9/30/2015.
 */
app.controller('IssueCtrl',['$scope', 'dataService', 'mySharedService', function ($scope, dataFactory, mySharedService) {

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
          'checked': true
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
    {categoryID: 1, categoryName: 'Accident or Personal working' },
    {categoryID: 2, categoryName: 'Goods is broken' }
  ];
  //Order: $scope.orders
  //$scope.countries = [
  //  {id: 1, text: 'USA', checked: false},
  //  {id: 2, text: 'France', checked: false},
  //  {id : 3, text: 'Japan3', checked: false}
  //];

  $scope.types_text = 'Choose Type of Issue';
  $scope.orders_text = 'Order get an Issue';
  $scope.val =  {single: null, multiple: null};

}]);


