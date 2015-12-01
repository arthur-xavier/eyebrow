/**
 * Eyebrow is a minimalistic single-page web library for JavaScript
 * So minimalistic it calls itself just Brow
 * So minimalistic it calls for use of basic traditional 
 HTML and JavaScript functionalities
 */
(function() {
  "use strict";

  var store = null;
  var params = null;

  var routes = [];
  var actions = {};
  var templates = {};

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
  var Brow = function(action, data) {
    var newStore;

    // reload view
    if(!action && !!view) {
      newStore = view.apply(view, [store].concat(params)) || store;
    }
    // app initialisation
    else if(typeof action === 'function') {
      return store = action.call(Brow, null, data);
    }
    // view action
    else if(!!view && !!view[action]) {
      newStore = view[action].call(view, store, data) || store;
    }
    // registered action
    else if(!!actions[action]) {
      newStore = actions[action].call(view, store, data) || store;
    }
    // registered route
    else {
      location.hash = "/" + action;
      return true;
    }

    // update view on store change
    if(newStore !== store) {
      store = newStore;
      Brow();
      return true;
    }
  };

  /**
   * Registers a new route handler
   *
   * @param  {RegExp}   route
   * @param  {Function} f
   * @return {[Object]} registered route handlers
   */
  Brow.route = function(route, f) {
    if(typeof route === 'string') {
      route = new RegExp(route.replace(/:([\_\w]+)/gi, '(.+)'));
    }
    routes.push({ regexp: route, view: f });
    return routes;
  };

  /**
   * Registers a new Eyebrow event handler
   *
   * @param  {String}   name
   * @param  {Function} f
   * @return {[Object]} registered event handlers
   */
  Brow.on = function(name, f) {
    actions[name] = f;
    return actions;
  };

  /**
   * Adds a new template rendering function to the templates collection
   *
   * @param  {String}   name
   * @param  {Function} f
   * @return {[Object]} templates collection
   */
  Brow.template = function(name, f) {
    templates[name] = f;
    return templates;
  };

  /**
   * Renders a template from the templates collection into the view element
   *
   * @param {String} name
   */
  Brow.render = function(name, selector, data) {
    data = data || view;
    if(!!selector) {
      if(typeof selector === 'string') {
        document.querySelector(selector).innerHTML = templates[name](view);
      } else if(selector.hasOwnProperty('innerHTML')) {
        selector.innerHTML = templates[name](data);
      } else {
        throw new Error('Eyebrow: can\'t render, invalid selector or DOM element provided');
      }
    } else {
      throw new Error('Eyebrow: can\'t render, invalid selector or DOM element provided');
    }
  };
  
  function loadViewFromHash() {
    event.preventDefault();
    // find route
    routes.forEach(function(r) {
      var newStore;
      var match = r.regexp.exec(location.hash.slice(1));
      // (route found)? ==> call view
      if(match !== null) {
        view = r.view;
        params = match.slice(1);
        newStore = view.apply(view, [store].concat(params)) || store;
        if(newStore !== store) {
          store = newStore;
          Brow();
        }
      }
    });
  }
  // loads view from hash on page load and on hash change
  window.addEventListener('load', loadViewFromHash);
  window.addEventListener('hashchange', loadViewFromHash);

  // export to globals
  window.Brow = Brow;
})();
