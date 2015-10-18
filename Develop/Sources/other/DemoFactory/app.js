var app = angular.module('customersApp',['ngRouter']);

app.config(['$routerProvider', function ($routerProvider){
	$routerProvider.when('/', {
		controller: 'customersController',
		templateUrl: '/app/views/customers.html'
	})
	.otherwise({redirectTo: '/'});
}]);