/**
 * Created by Nguyen Van Quyen on 10/6/2015.
 */
app.controller('TasksCtrl', function ($scope) {

  $scope.orderTasks = [
    {orderID: 1, shipperID: 002, title: 'Angel cake' },
    {orderID: 2, shipperID: 002, title: 'Angel food cake' },
    {orderID: 3, shipperID: 002, title: 'Apple cake' },
    {orderID: 4, shipperID: 002, title: 'Angel food cake' },
    {orderID: 5, shipperID: 003, title: 'Applesauce cake' },
    {orderID: 6, shipperID: 003, title: 'Aranygaluska' },
    {orderID: 7, shipperID: 003, title: 'Babka' },
    {orderID: 8, shipperID: 003, title: 'Better than sex cake' },
    {orderID: 9, shipperID: 003, title: 'Banana cake/bread' }
  ];
});
