'use strict';

var _ = require('lodash');

/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
module.exports = _.merge(_.cloneDeep(require('../base/Controller')), {



    subscribe: function(req, res) {

        if (!req.isSocket) {
            sails.log.error("UserController:subscribe failed")
            return res.badRequest('Only a client socket can subscribe.');
        }

        var roomName = 'user.' + req.param("id") + '.updated';
        sails.sockets.join(req.socket, roomName);
        res.json({
            room: roomName
        });
    },

    update : function(req,res) {

        sails.log(req.body)

        var user = req.body;
        var passports = req.body.passports
        var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

        // Delete unwanted properties
        delete user.passports
        delete user.password_confirmation


        sails.models.user
            .update({id : req.param('id')},user)
            .exec(function(err,updated){
                if(err) return res.negotiate(err);

                var user = updated[0];

                if(!user) {
                  return  res.json()
                }

                if(user.node) {
                    sails.models.kongnode
                        .findOne({id : user.node})
                        .exec(function(err,node){
                            if(err) return res.negotiate(err)
                            user.node = node;
                            sails.sockets.blast('user.' + user.id + '.updated', user);
                        })
                }else{
                    sails.sockets.blast('user.' + user.id + '.updated', user);
                }


                if(!passports) return res.json(user)
                    
                if(!re.test(String(passports.password))) {
                   return res.badRequest({
                    error: 'Password must be at least 8 characters and include uppercase letters, lowercase letters, and numbers.'
                  });
                }

                sails.models.passport
                    .update({user:req.param('id')},{password:passports.password})
                    .exec(function(err,updatedPassport){
                        if(err) return res.negotiate(err);
                        return  res.json(user)
                    })



        })
    }
});
