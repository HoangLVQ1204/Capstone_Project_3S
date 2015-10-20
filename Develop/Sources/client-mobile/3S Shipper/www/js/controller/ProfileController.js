/**
 * Created by Kaka Hoang Huy on 9/30/2015.
 */
app.controller('ProfileCtrl', function ($scope) {
  $scope.profile =
    { name: 'Nguyen Van Long', dob: '19/2/1993',
      identitycard: '176287777', phonenumber: '0988767822',
      email: 'long81@gmail.com', address: 'Quận Đống Đa Hà Nội'
    };
});
