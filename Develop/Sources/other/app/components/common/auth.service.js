/**
 * Created by hoanglvq on 9/22/15.
 */
module.exports = function() {

    var userIsLoggedIn = function(callback) {
        var role = {
            isAdmin : true,
            isStore : false,
            isGuest : false
        }
        callback(role);

    }

    return {
        userIsLoggedIn: userIsLoggedIn
    };
};


