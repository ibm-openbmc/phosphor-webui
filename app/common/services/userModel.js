/**
 * userModel
 *
 * @module app/common/services/userModel
 * @exports userModel
 * @name userModel

 */

window.angular && (function(angular) {
  'use strict';

  angular.module('app.common.services').service('userModel', [
    'APIUtils',
    function(APIUtils) {
      return {
        login: function(username, password, callback) {
          APIUtils.login(username, password, function(response, error) {
            // if extendedMessage is present in the response, the password is
            // expired
            if (response.data['extendedMessage']) {
              callback(false, false, response.statusText);
            } else if (
                response.data &&
                (response.data.status == APIUtils.API_RESPONSE.SUCCESS_STATUS ||
                 response.data.status === undefined)) {
              sessionStorage.setItem('LOGIN_ID', username);
              callback(true, true, response.statusText);
            } else if (
                response && response.data && response.data.data &&
                response.data.data.description) {
              callback(false, response.data.data.description);
            } else if (response && response.statusText) {
              callback(false, response.statusText);
            } else if (error) {
              callback(false, 'Server unreachable');
            } else {
              callback(false, 'Internal error');
            }
          });
        },
        isLoggedIn: function() {
          if (sessionStorage.getItem('LOGIN_ID') === null) {
            return false;
          }
          return true;
        },
        logout: function(callback) {
          APIUtils.logout(function(response, error) {
            if (response &&
                response.status == APIUtils.API_RESPONSE.SUCCESS_STATUS) {
              sessionStorage.removeItem('LOGIN_ID');
              sessionStorage.removeItem(APIUtils.HOST_SESSION_STORAGE_KEY);
              callback(true);
            } else if (response.status == APIUtils.API_RESPONSE.ERROR_STATUS) {
              callback(false);
            } else {
              callback(false, error);
            }
          });
        }
      };
    }
  ]);
})(window.angular);
