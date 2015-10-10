/**
 * Created by Nguyen Van Quyen on 10/6/2015.
 */
app.controller('TasksCtrl', function ($scope) {

  $scope.orders = [{
    id: 1,
    code: 'ORD001-001',
    statusid: 'Done',
    ordertypeid: '1',
    pickupaddress: 'Đại Học Công Nghiệp - Từ Liêm - Hà Nội',
    deliveryaddress: 'Đại Học Cảnh Sát - Cổ Nhuế - Hà Nội'
  }, {
    id: 2,
    code: 'ORD002-202',
    statusid: 'Picking',
    ordertypeid: '2',
    pickupaddress: 'Từ Liêm - Hà Nôi',
    deliveryaddress: 'Quận Đống Đa - Hà Nội'
  }, {
    id: 3,
    code: 'ORD888-222',
    statusid: 'Delivering',
    ordertypeid: '2',
    pickupaddress: 'Phường Nguyễn Du - Quận Hai Bà Trưng - Hà Nội',
    deliveryaddress: 'Phường Quỳnh Mai - Quận Hai Bà Trưng - Hà Nội'
  }, {
    id: 4,
    code: 'ORD999-000',
    statusid: 'Pending',
    ordertypeid: '1',
    pickupaddress: 'Phường Bồ Đề - Long Biên - Hà Nội',
    deliveryaddress: 'Mễ Trì - Nam Từ Liêm - Hà Nội'
  }, {
    id: 5,
    code: 'ORD222-123',
    statusid: 'Picking',
    ordertypeid: '2',
    pickupaddress: 'Xuân Phương - NamTừ Liêm - Hà Nôi',
    deliveryaddress: 'Tràng Tiền - Hoàn Kiếm - Hà Nội'
  }, {
    id: 6,
    code: 'ORD002-90933',
    statusid: 'Pending',
    ordertypeid: '1',
    pickupaddress: 'Quang Trung - Hà Đông - Hà Nôi',
    deliveryaddress: 'Hàng Bông - Quận Hoàn Kiếm - Hà Nội'
  }, {
    id: 7,
    code: 'ORD022-252',
    statusid: 'Picking',
    ordertypeid: '2',
    pickupaddress: 'Từ Liêm - Hà Nôi',
    deliveryaddress: 'Quận Đống Đa - Hà Nội'
  }, {
    id: 8,
    code: 'ORD032302-222',
    statusid: 'Delivering',
    ordertypeid: '2',
    pickupaddress: 'Xuân Phương - Nam Từ Liêm - Hà Nôi',
    deliveryaddress: 'Quận Đống Đa - Hà Nội'
  }];
});
