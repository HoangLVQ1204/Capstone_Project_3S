/**
 * Created by hoanglvq on 10/25/15.
 */
angular.module('app')
    .factory('socketStore',['socketService',function($socketService){
        $socketService.on('init',function(data){
            console.log(data.name);
        })
    }]);