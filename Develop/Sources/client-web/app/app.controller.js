/**
 * Created by hoanglvq on 9/22/15.
 */

function AppController($state, authService){
    var checkType =
    authService.userIsLoggedIn(function(role){
        if(role.isAdmin){
            $state.go('app.admin');
        }else if(role.isStore){
            $state.go('app.store');
        }else{
            $state.go('app.guest');
        }
    });

    var iconData = [
        {name: 'icon-home'        , color: "#777" },
        {name: 'icon-user-plus'   , color: "rgb(89, 226, 168)" },
        {name: 'icon-google-plus2', color: "#A00" },
        {name: 'icon-youtube4'    , color:"#00A" },
        // Use theming to color the font-icon
        {name: 'icon-settings'    , color:"#A00", theme:"md-warn md-hue-5"}
    ];
    // Create a set of sizes...

    var fonts = [].concat(iconData);

    console.log(fonts);
}
AppController.$inject = ['$state','authService'];
module.exports = AppController;