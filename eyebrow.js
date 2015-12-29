/**
 * Eyebrow is a minimalistic view layer library for JavaScript
 * So minimalistic it calls itself just Brow
 */
var window = window || {};
var module = module || {};

(function(window, module) {
  "use strict";

  var document = window.document || null;

  var Eyebrow = function() {

    var store = null;
    var params = null;
    var view = null;

    /**
     * Calls for an action within the Eyebrow context
     * When called with no arguments, Brow reloads the current view
     * When the first argument is a function, it resets the application,
     restoring the stored data
     * When called with a String as first argument, it calls such function
     within the view context and, if no function is found it then attempts
     to execute a registered event. If no event is found as well, the string
     is appended to the window hash prefixed with '/'
     *
     * @param {String|Function} action
     * @param {Object}          data
     */
    var app = function(action) {
      var newStore;
      var data = Array.prototype.slice.call(arguments, 1);

      // reload view
      if(!action && !!view) {
        return view.apply(view, [store].concat(params));
      }
      // app initialisation
      else if(typeof action === 'function') {
        return (store = action.apply(app, [store].concat(data)));
      }
      // view action
      else if(!!view && !!view[action]) {
        newStore = view[action].apply(view, [store].concat(data)) || store;
      }
      // registered action
      else if(!!app.actions[action]) {
        newStore = app.actions[action].apply(app, [store].concat(data)) || store;
      }
      // registered route
      else {
        location.hash = "/" + action;
        return true;
      }

      // update view on store change
      if(newStore !== store) {
        store = newStore;
        app();
        return true;
      } else {
        return false;
      }
    };

    app.routes = [];
    app.actions = {};
    app.templates = {};


    /**
     * Registers a new route handler
     *
     * @param  {RegExp}   route
     * @param  {Function} f
     * @return {[Object]} registered route handlers
     */
    app.route = function(route, f) {
      if(typeof route === 'string') {
        route = new RegExp(route.replace(/:([\_\w]+)/gi, '(.+)') + '$');
      }
      app.routes.push({ regexp: route, view: f });
      return app.routes;
    };

    /**
     * Registers a new Eyebrow event handler
     *
     * @param  {String}   name
     * @param  {Function} f
     * @return {[Object]} registered event handlers
     */
    app.on = function(name, f) {
      app.actions[name] = f;
      return app.actions;
    };

    /**
     * Adds a new template rendering function to the templates collection
     *
     * @param  {String}   name
     * @param  {Function} f
     * @return {[Object]} templates collection
     */
    app.template = function(name, f) {
      app.templates[name] = f;
      return app.templates;
    };

    /**
     * Renders a template from the templates collection into the view element
     *
     * @param {String} name
     */
    app.render = function(template, selector, data) {
      data = data || view;
      var rendered = app.templates[template](data);
      if(!!selector) {
        if(typeof selector === 'string' && document) {
          Array.prototype.forEach.call(document.querySelectorAll(selector), function($el) {
            $el.innerHTML = rendered;
          });
        } else {
          selector.innerHTML = rendered;
        }
      }
      return rendered;
    };

    app._loadViewFromHash = function(hash) {
      if(event) event.preventDefault();
      // find route
      app.routes.forEach(function(r) {
        var newStore;
        var match = r.regexp.exec(location ? location.hash.slice(1) : hash);
        //* Route found? ==> Call view
        if(match !== null) {
          view = r.view;
          params = match.slice(1);
          if(view) {
            newStore = view.apply(view, [store].concat(params)) || store;
            if(newStore !== store) {
              store = newStore;
              app();
            }
          } else {
            throw new Error("Eyebrow: view function is undefined");
          }
        }
      });
    };

    // loads view from hash on page load and on hash change
    if(typeof window.addEventListener === 'function') {
      window.addEventListener('load', app._loadViewFromHash);
      window.addEventListener('hashchange', app._loadViewFromHash);
    }

    return app;
  };

  // export to globals
  window.Eyebrow = Eyebrow;
  module.exports = Eyebrow;
})(window, module);
