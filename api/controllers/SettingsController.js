'use strict';

var _ = require('lodash');

/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
module.exports = _.merge(_.cloneDeep(require('../base/Controller')), {

  find: function (req, res) {

    sails.models.settings.find().limit(1)
      .exec(function (err, settings) {

        if (err) return res.negotiate(err)

        var _settings = settings[0];
        if(!_settings) {
          sails.KONGA_CONFIG = {}
          return res.json({})
        }

        // Remove integrations from public json
        delete _settings.data.integrations;

        // Store settings in memory
        sails.KONGA_CONFIG = settings[0].data || {}
        return res.json(settings[0] ? settings[0] : {})
      })
  },

  initial: function (req, res) {
    sails.models.settings.find().limit(1)
      .exec(function (err, settings) {

        if (err) return res.negotiate(err)

        var _settings = settings[0];
        if(!_settings) {
          sails.KONGA_CONFIG = {}
          return res.json({})
        }

        sails.KONGA_CONFIG = settings[0].data || {}
        return res.json(
          {
            "id": settings[0].data.id,
            "data": {
              "signup_enable": false,
              "signup_require_activation": false,
              "info_polling_interval": 0,
              "email_default_sender_name": "KONGA",
              "email_default_sender": "konga@konga.test",
              "email_notifications": false,
              "default_transport": "sendmail",
              "notify_when": {
                "node_down": {
                  "title": "A node is down or unresponsive",
                  "description": "Health checks must be enabled for the nodes that need to be monitored.",
                  "active": false
                },
                "api_down": {
                  "title": "An API is down or unresponsive",
                  "description": "Health checks must be enabled for the APIs that need to be monitored.",
                  "active": false
                }
              },
              "user_permissions": {
                "apis": {
                  "create": false,
                  "read": false,
                  "update": false,
                  "delete": false
                },
                "services": {
                  "create": false,
                  "read": false,
                  "update": false,
                  "delete": false
                },
                "routes": {
                  "create": false,
                  "read": false,
                  "update": false,
                  "delete": false
                },
                "consumers": {
                  "create": false,
                  "read": false,
                  "update": false,
                  "delete": false
                },
                "plugins": {
                  "create": false,
                  "read": false,
                  "update": false,
                  "delete": false
                },
                "upstreams": {
                  "create": false,
                  "read": false,
                  "update": false,
                  "delete": false
                },
                "certificates": {
                  "create": false,
                  "read": false,
                  "update": false,
                  "delete": false
                },
                "connections": {
                  "create": false,
                  "read": false,
                  "update": false,
                  "delete": false
                },
                "users": {
                  "create": false,
                  "read": false,
                  "update": false,
                  "delete": false
                }
              }
            }
          }
        )
      })
  },

  getIntegrations : function (req,res) {
    sails.models.settings.find().limit(1)
      .exec(function (err, settings) {

        if (err) return res.negotiate(err)

        if(!settings[0]) {
          return res.json({})
        }

        return res.json(settings[0].data.integrations);
      })
  }
});
