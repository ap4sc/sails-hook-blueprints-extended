/**
 * Derived from: https://github.com/sgress454/sails-hook-custom-blueprints/blob/master/index.js
 */

 var includeAll = require('include-all');
 const sailsBlueprintsDir = '../sails/lib/hooks/blueprints/actions';
 var _ = require('lodash');

/**
 * sails-hook-blueprints-extended
 *
 * @description :: A hook to set custom sails blueprints, and expose default ones
 * @docs        :: https://github.com/ian-collier/sails-hook-blueprints-extended#readme
 */


module.exports = function hook(sails) {

    const TAG = "sails-hook-blueprints-extended: ";

    // Load blueprints from sails library
    var defaultBlueprintsDict = {
        add: require(sailsBlueprintsDir + '/add'),
        create: require(sailsBlueprintsDir + '/create'),
        destroy: require(sailsBlueprintsDir + '/destroy'),
        find: require(sailsBlueprintsDir + '/find'),
        findone: require(sailsBlueprintsDir + '/findOne'),
        populate: require(sailsBlueprintsDir + '/populate'),
        remove: require(sailsBlueprintsDir + '/remove'),
        replace: require(sailsBlueprintsDir + '/replace'),
        update: require(sailsBlueprintsDir + '/update')
    };

    var customBlueprintsDict = {};



    return {

        initialize: function(cb) {

            // If the global blueprints hook isn't active, don't enable custom blueprints.
            if (!sails.hooks.blueprints) {
                sails.log.info(TAG + "Skipping activation of custom blueprints hook since global 'sails.hooks.blueprints' is disabled!");
                return cb();
            }

            // After the blueprints hook loads, load and register any custom blueprint actions.
            sails.after('hook:blueprints:loaded', function() {

                // Load blueprint actions from the configured folder (defaults to `api/blueprints`)
                includeAll.optional({
                    dirname: sails.config.paths.blueprints,
                    filter: /^([^.]+)\.(?:(?!md|txt).)+$/,
                    depth: 1,
                    replaceExpr : /^.*\//,
                }, function(err, files) {
                    if(err) {
                        sails.log.error(TAG + err);
                        return cb();
                    }

                    // Loop through all of the loaded models.
                    _.each(_.keys(sails.models), function(modelIdentity) {
                        // Loop through all of the loaded blueprints and register an action for each one
                        // that's specific to this model, e.g. `user/find`.
                        _.each(files, function(blueprintAction, blueprintName) {
                            sails.registerAction(blueprintAction, modelIdentity + '/' + blueprintName, true);
                        });
                    });

                    // Loop through all of the loaded blueprints and set custom functions
                    _.each(files, function(blueprintAction, blueprintName) {
                        customBlueprintsDict[blueprintName] = blueprintAction;
                    });

                    return cb();
                });
            });
        },

        // Exposed default blueprints
        default: defaultBlueprintsDict,

        // Exposed custom blueprints
        custom: customBlueprintsDict,
  };

};
