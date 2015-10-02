/**
 * Created by Kaka Hoang Huy on 9/30/2015.
 */
var app = angular.module('history', ['ngCordova']);

app.controller('HistoryCtrl', function ($scope) {
  $scope.historyorders = [
    { code: '123453', fee: 12000, id: 1 },
    { code: '423434', fee: 25000, id: 2 },
    { code: '201093', fee: 30000, id: 3 },
    { code: '240593', fee: 22000, id: 4 }
  ];
})

app.controller('DetailCtrl', function ($scope, $stateParams) {
});
