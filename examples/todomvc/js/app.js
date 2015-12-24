/* globals Brow, TodosView, Handlebars */
(function(Brow) {
  'use strict';

  Handlebars.registerHelper('eq', function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
  });

  Brow(function() {
    // setup routes
    Brow.route(/^\/?$/, TodosView);
    Brow.route(/^\/(\w+)?$/, TodosView);

    // setup templates
    Brow.template('todos', Handlebars.compile(document.getElementById('todos-template').innerHTML));
    Brow.template('footer', Handlebars.compile(document.getElementById('footer-template').innerHTML));

    // load stored data on localStorage or create new
    return JSON.parse(localStorage.getItem('todos-brow')) || [];
  });

})(window.Brow);
