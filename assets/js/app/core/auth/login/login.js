/**
 * Messages component which is divided to following logical components:
 *
 *  Controllers
 *
 * All of these are wrapped to 'frontend.auth.login' angular module.
 */
(function () {
    'use strict';

    // Define frontend.auth.login angular module
    angular.module('frontend.core.auth.login', []);

    // Module configuration
    angular.module('frontend.core.auth.login')
        .config([
            '$stateProvider',
            function config($stateProvider) {
                $stateProvider
                    // Login
                    .state('auth.login', {
                        url: '/login?activated',
                        data: {
                            access: 0
                        },
                        params: {
                            activated: null
                        },
                        views: {
                            'authContent': {
                                templateUrl: 'js/app/core/auth/login/login.html',
                                controller: 'LoginController'
                            },

                        }
                    })
                ;
            }
        ])
        .controller('LoginController', [
            '$scope', '$state', '$stateParams',
            'AuthService', 'FocusOnService', 'MessageService',
            function controller($scope, $state, $stateParams,
                                AuthService, FocusOnService, MessageService) {


                // Scope function to perform actual login request to server
                $scope.login = function login() {
                    $scope.busy = true;
                    AuthService
                        .login($scope.credentials)
                        .then(
                            function successCallback() {
                                $(".login-form-container").remove();
                                $state.go('dashboard');
                                $scope.busy = false;
                            },
                            function errorCallback(err) {
                                $scope.busy = false;
                            }
                        )
                    ;
                };

                /**
                 * Maximum number of login attempts
                 *
                 * @type {number}
                 */
                $scope.maxLoginAttempts = 5;

                /**
                 * Checks if user has exceeded maximum number of login attempts
                 * 
                 * @returns {boolean}
                 */
                $scope.hasExceededAttempts = function () {
                    return AuthService.getLoginAttempts() >= $scope.maxLoginAttempts;
                };


                /**
                 * Function to check if user is locked out
                 * 
                 * @returns {boolean}
                 */
                $scope.isLockedOut = function () {
                    return AuthService.getLockoutTimeRemaining() > 0;
                };

                /**
                 * Function to get remaining lockout time
                 * 
                 * @returns {string}
                 */
                $scope.getLockoutTimeFormatted = function() {
                    var ms = AuthService.getLockoutTimeRemaining();
                    var totalSeconds = Math.floor(ms / 1000);
                    var minutes = Math.floor(totalSeconds / 60);
                    var seconds = totalSeconds % 60;
                  
                    var parts = [];
                    if (minutes > 0) {
                      parts.push(minutes + ' minute' + (minutes !== 1 ? 's' : ''));
                    }
                    parts.push(seconds + ' second' + (seconds !== 1 ? 's' : ''));
                  
                    return parts.join(' ');
                  };

                /**
                 * Private helper function to reset credentials and set focus to username input.
                 *
                 * @private
                 */
                function _reset() {
                    FocusOnService.focus('username');

                    // Initialize credentials
                    $scope.credentials = {
                        identifier: '',
                        password: ''
                    };
                }

                _reset();
            }
        ])
    ;
}());
