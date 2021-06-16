# sails-hook-blueprints-extended

***This project is no longer being updated***

A Sails.js hook to add custom blueprints, and expose default blueprint functions. Derived from: [sails-hook-custom-blueprints](https://github.com/sgress454/sails-hook-custom-blueprints).

### Installation

`npm install sails-hook-blueprints-extended --save`

### Usage

#### Custom Blueprints

Blueprints are the controller definitions that apply to all Models. Custom blueprints are blueprints that override the defaults.

These can be placed in the directory set by `sails.config.paths.blueprints`, which by default is `./api/blueprints`.

Custom blueprint filenames must correspond to the name of the default blueprint they override:


* `add -> add.js`
* `create -> create.js`
* `destroy -> destroy.js`
* `find -> find.js`
* `findOne -> findone.js`
* `populate -> populate.js`
* `remove -> remove.js`
* `replace -> replace.js`
* `update -> update.js`

##### Example

To override the `findOne` blueprint, we would create the file `findone.js` like this:

```javascript
/*
*  ./api/blueprints/findone.js
*/

// You should always export a single "function(req, res)"
module.exports = function findOneRecord (req, res) {

    // Custom blueprint code here
    return req.badRequest("findOne disabled.");
};

```

Now the action for `findOne` will be overriden for all models. Routes to `/:model/:id` will use this action.

#### Globally Accessing Blueprints

Blueprints are exposed globally in your application using this hook, meaning you can access them from your controllers.

Default blueprints, as defined in the Sails library, are availible at `sails.hooks.extblueprints.default`.

Custom blueprints, as defined in your project, are availible at `sails.hooks.extblueprints.custom`.
Please note that these will only be defined for the custom blueprints you have set.

Full list of functions:

```javascript
// Always availible
sails.hooks.extblueprints.default.add(req, res);
sails.hooks.extblueprints.default.create(req, res);
sails.hooks.extblueprints.default.destroy(req, res);
sails.hooks.extblueprints.default.find(req, res);
sails.hooks.extblueprints.default.findone(req, res);
sails.hooks.extblueprints.default.populate(req, res);
sails.hooks.extblueprints.default.remove(req, res);
sails.hooks.extblueprints.default.replace(req, res);
sails.hooks.extblueprints.default.update(req, res);

// Only availible if a custom blueprint is set
sails.hooks.extblueprints.custom.add(req, res);
// ... same function names as above
```

#### Overriding Default/Custom Blueprints in a Controller

As normally, default blueprint actions can be overriden by exporting a function in your controller of the same name. With this hook enabled, this will also override custom blueprints.

The advantage of this hook is it adds the ability to call the "super" function of the blueprint you override. Now you can override blueprints without discarding their original functionality.

##### Example

Assume for this example we already have custom `update.js` and `remove.js` blueprints set.

```javascript
/*
*  ./api/controllers/SampleController.js
*/

module.exports = {

    // Updates but checks for a valid username first
    update: function (req, res) {

        // Custom request check
        if(req.param('username', '').toString() === 'John') {
            res.badRequest("Username cannot be 'John'");
        }

        // Call custom super
        return sails.hooks.extblueprints.custom.update(req, res);
    },

    // Removes using the default blueprint instead of custom
    remove: function (req, res) {
        // Call default super
        return sails.hooks.extblueprints.default.remove(req, res);
    },

    // We can also use blueprints in other controllers
    foo: function (req, res) {

        /* Do something */

        return sails.hooks.extblueprints.default.add(req, res);
    }

};


```


### Troubleshooting

* If all blueprints aren't working, ensure that they are enabled in your sails config.
* Ensure your custom blueprint filenames match the defaults.
* Ensure that custom blueprints export only a `function(req, res)`.

### Limitations

These functions use the original definitions in the Sails library. If you are somehow overriding them in `./api/blueprints` those definitions will **not** be exposed.


### Notice

*This project has no affiliations with the [ official Sails.js framework](https://sailsjs.com/).*
