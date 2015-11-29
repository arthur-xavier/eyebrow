/**
 * Eyebrow is a minimalistic single-page web framework
 * So minimalistic it calls itself just Brow
 * So minimalistic it calls for use of basic traditional 
 HTML and JavaScript functionalities
 */
(function(window, module) {
  "use strict";

  var store = null;

  var routes = [];
  var actions = {};
  var templates = {};

  var view = null;
  var $view = null;

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
   * @param {string|function} action
   * @param {object}          data
   */
  var Brow = function(action, data) {
    // reload view
    if(!action && !!view) {
      store = view.call(view, store) || store;
    // app initialisation
    } else if(typeof action === 'function') {
      store = action.call(Brow, null, data);
    // view action
    } else if(!!view && !!view[action]) {
      store = view[action].call(view, store, data) || store;
    // registered action
    } else if(!!actions[action]) {
      store = actions[action].call(view, store, data) || store;
    // registered route
    } else {
      location.hash = "/" + action;
    }
  };

  /**
   * Registers a new route handler
   *
   * @param  {RegExp}         route
   * @param  {function}       f
   * @return {Array.<object>} registered route handlers
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
   * @param  {string}         name
   * @param  {function}       f
   * @return {Array.<object>} registered event handlers
   */
  Brow.on = function(name, f) {
    actions[name] = f;
    return actions;
  };

  /**
   * Adds a new template rendering function to the templates collection
   *
   * @param  {string}         name
   * @param  {function}       f
   * @return {Array.<object>} templates collection
   */
  Brow.template = function(name, f) {
    templates[name] = f;
    return templates;
  };

  /**
   * Renders a template from the templates collection into the view element
   *
   * @param {string} name
   */
  Brow.render = function(name, selector) {
    if(!!selector) {
      if(typeof selector === 'string') {
        Brow.$(selector).innerHTML = templates[name](view);
      } else {
        selector.innerHTML = templates[name](view);
      }
    } else {
      if(!$view) throw new Error('Eyebrow: can\'t render, no DOM element for view defined');
      $view.innerHTML = templates[name](view);
    }
  };

  /**
   * Scoped querySelector
   * @param  {string}     selector
   * @param  {DOMElement} scope
   * @return {Node}
   */
  Brow.$ = function(selector, scope) {
    return (scope || document).querySelector(selector);
  };
  /**
   * Scoped querySelectorAll
   * @param  {string}     selector
   * @param  {DOMElement} scope
   * @return {NodeList}
   */
  Brow.$all = function(selector, scope) {
    return (scope || document).querySelectorAll(selector);
  };
  /**
   * Adds an event listener to an event on target element
   * @param  {DOMElement} target
   * @param  {string}     type       Event type
   * @param  {function}   callback
   * @param  {boolean}    useCapture
   */
  Brow.$on = function(target, type, callback, useCapture) {
    target.addEventListener(type, callback, !!useCapture);
  };
  // make NodeList iterable using Array's forEach
  NodeList.prototype.forEach = Array.prototype.forEach;

  
  function loadViewFromHash() {
    event.preventDefault();
    // find route
    routes.forEach(function(r) {
      var match = r.regexp.exec(location.hash.slice(1));
      // (route found)? ==> call view
      if(match !== null) {
        view = r.view;
        store = view.apply(view, [store].concat(match.slice(1))) || store;
        return false;
      }
    });
  }
  // loads view from hash on page load and on hash change
  Brow.$on(window, 'load', loadViewFromHash);
  Brow.$on(window, 'hashchange', loadViewFromHash);


  // initialize Eyebrow view rendering section
  $view = document.querySelector('[role="main"]');

  window.Brow = Brow;

})(window || {});
