'use strict';

/**
 * Policy to set necessary create data to body.
 *
 * @param   {Request}   request     Request object
 * @param   {Response}  response    Response object
 * @param   {Function}  next        Callback function
 */

function alphanum(value) {
    if (/[^a-zA-Z0-9]/.test(value)) {
        return false;
    }
    return true;
}

module.exports = function createUser(request, response, next) {
    sails.log.verbose(__filename + ':' + __line + ' [Policy.createUser() called]');

    if (!request.body.passports) return next()

    var password = request.body.passports.password
    var confirmation = request.body.password_confirmation
    var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    sails.log('[Policy.createUser()] -> password : ' + password);
    sails.log('[Policy.createUser()] -> confirmation : ' + confirmation);

    if (!password) {
        var error = new Error();

        error.Errors = {
            password: [
                {
                    message: 'The password field is required.'
                }
            ]
        }

        error.status = 400;

        return next(error);
    }

    if (!re.test(String(password))) {
        var error = new Error();
  
        error.Errors = {
          password: [
            {
              message: "Password must be at least 8 characters and include uppercase letters, lowercase letters, and numbers.",
            },
          ],
        };
        error.status = 400;
  
        next(error);
    }

    if (password != confirmation) {
        var error = new Error();

        error.Errors = {
            password_confirmation: [
                {
                    message: 'Password and password confirmation don\'t match'
                }
            ]
        }

        error.status = 400;

        return next(error);
    } else {
        next();
    }
};
