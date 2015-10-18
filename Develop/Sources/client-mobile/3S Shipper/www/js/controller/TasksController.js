/**
 * Created by Nguyen Van Quyen on 10/6/2015.
 */
app.controller('TasksCtrl', ['$scope', 'dataFactory', function($scope, dataFactory) {

  $scope.orders = [{
    id: 1,
    code: 'ORD001-001',
    statusid: 'Done',
    ordertypeid: 1,
    date: 'Đại Học Công Nghiệp - Từ Liêm - Hà Nội',
    fee: 'Đại Học Cảnh Sát - Cổ Nhuế - Hà Nội'
  }, {
    id: 2,
    code: 'ORD002-202',
    statusid: 'Picking',
    ordertypeid: 2,
    date: 'Từ Liêm - Hà Nôi',
    fee: 'Quận Đống Đa - Hà Nội'
  }, {
    id: 3,
    code: 'ORD888-222',
    statusid: 'Delivering',
    ordertypeid: 2,
    date: 'Phường Nguyễn Du - Quận Hai Bà Trưng - Hà Nội',
    fee: 'Phường Quỳnh Mai - Quận Hai Bà Trưng - Hà Nội'
  }, {
    id: 4,
    code: 'ORD999-000',
    statusid: 'Pending',
    ordertypeid: 1,
    date: 'Phường Bồ Đề - Long Biên - Hà Nội',
    fee: 'Mễ Trì - Nam Từ Liêm - Hà Nội'
  }, {
    id: 5,
    code: 'ORD222-123',
    statusid: 'Picking',
    ordertypeid: 2,
    date: 'Xuân Phương - NamTừ Liêm - Hà Nôi',
    fee: 'Tràng Tiền - Hoàn Kiếm - Hà Nội'
  }, {
    id: 6,
    code: 'ORD002-90933',
    statusid: 'Pending',
    ordertypeid: 1,
    date: 'Quang Trung - Hà Đông - Hà Nôi',
    fee: 'Hàng Bông - Quận Hoàn Kiếm - Hà Nội'
  }, {
    id: 7,
    code: 'ORD022-252',
    statusid: 'Picking',
    ordertypeid: 2,
    date: 'Từ Liêm - Hà Nôi',
    fee: 'Quận Đống Đa - Hà Nội'
  }, {
    id: 8,
    code: 'ORD032302-222',
    statusid: 'Delivering',
    ordertypeid: 2,
    date: 'Xuân Phương - Nam Từ Liêm - Hà Nôi',
    fee: 'Quận Đống Đa - Hà Nội'
  }, {
    id: 9,
    code: 'ORD03232302-222',
    statusid: 'Delivering',
    ordertypeid: 3,
    date: 'Xuân Phương - Nam Từ Liêm - Hà Nôi',
    fee: 'Quận Đống Đa - Hà Nội'
  }, {
    id: 10,
    code: 'ORD032302-09090',
    statusid: 'Pending',
    ordertypeid: 3,
    date: 'Xuân Phương - Bắc Từ Liêm - Hà Nôi',
    fee: 'Quận Đống Đa - Hà Nội'
  }, {
    id: 11,
    code: 'ORD032eee302-222',
    statusid: 'Delivering',
    ordertypeid: 3,
    date: 'Xuân Phương - Nam Từ Liêm - Hà Nôi',
    fee: 'Quận Nam Từ Liêm - Hà Nội'
  }
  ];
  $scope.orders = [];
  var urlBase = 'http://localhost:3000/api/tasks';
  var data = {};
  getDataFromServer();

  function getDataFromServer() {
    dataFactory.getDataServer(urlBase, data)
      .success(function (rs) {
        $scope.orders = rs;
        alert(111);
        console.log(rs);
      })
      .error(function (error) {
        console.log('Unable to load customer data: ' + error);
      });
  }

}]);
