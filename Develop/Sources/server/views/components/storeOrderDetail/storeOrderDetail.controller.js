/**
 * Created by hoanglvq on 9/22/15.
 */

function storeOrderDetailController($scope,$state,dataService, $http, config){    
// $(document).ready(function() {
//   	$('#rootwizard').bootstrapWizard({
// 					tabClass:"nav-wizard",
// 	                onTabShow: function(tab, navigation, index) {
// 					   tab.prevAll().addClass('completed');
// 						tab.nextAll().removeClass('completed');
// 						if(tab.hasClass("active")){
// 							tab.removeClass('completed');
// 						}
// 						var $total = navigation.find('li').length;
// 						var $current = index+1;
// 						var $percent = ($current/$total) * 100;
// 						$('#rootwizard').find('.progress-bar').css({width:$percent+'%'});
// 						$('#rootwizard').find('.wizard-status span').html($current+" / "+$total);
//                     }
// 	});
	
// 	$('#validate-wizard').bootstrapWizard({
// 			tabClass:"nav-wizard",
// 			onNext: function(tab, navigation, index) {
// 							var content=$('#step'+index);
// 							if(typeof  content.attr("parsley-validate") != 'undefined'){
// 											var $valid = content.parsley( 'validate' );
// 											if(!$valid){
// 															return false;
// 											}
// 							};
// 			// Set the name for the next tab
// 			$('#step4 h3').find("span").html($('#fullname').val());
// 			},
// 			onTabClick: function(tab, navigation, index) {
// 							$.notific8('Please click <strong>next button</strong> to wizard next step!! ',{ life:5000, theme:"danger" ,heading:" Wizard Tip :); "});
// 							return false;
// 			},
// 			onTabShow: function(tab, navigation, index) {
// 							tab.prevAll().addClass('completed');
// 							tab.nextAll().removeClass('completed');
// 							if(tab.hasClass("active")){
// 											tab.removeClass('completed');
// 							}
// 							var $total = navigation.find('li').length;
// 							var $current = index+1;
// 							var $percent = ($current/$total) * 100;
// 							$('#validate-wizard').find('.progress-bar').css({width:$percent+'%'});
// 							$('#validate-wizard').find('.wizard-status span').html($current+" / "+$total);
// 			}
// 	});

// });
}


storeOrderDetailController.$inject = ['$scope','$state','dataService','$http','config'];

angular.module('app').controller('storeOrderDetailController',storeOrderDetailController);

