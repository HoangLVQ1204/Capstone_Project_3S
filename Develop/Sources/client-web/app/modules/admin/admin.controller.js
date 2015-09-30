/**
 * Created by hoanglvq on 9/22/15.
 */
function AdminController($state) {
    this.menu = [
        {
            link : '',
            title: 'Dashboard',
            icon : 'dashboard'
        },
        {
            link : '',
            title: 'Order',
            icon : 'dashboard'
        },
        {
            link : '',
            title: 'Store',
            icon : 'dashboard'
        },
        {
            link : '',
            title: 'Shipper',
            icon : 'dashboard'
        },
        {
            link : '',
            title: 'Configure',
            icon : 'dashboard'
        },
    ]
    this.title = 'This is Admin Page';
}

AdminController.$inject = ['$state'];

module.exports = AdminController;