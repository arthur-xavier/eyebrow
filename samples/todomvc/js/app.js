(function(Brow) {
  'use strict';

  Handlebars.registerHelper('eq', function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
  });

  Brow(function() {
    // setup routes
    Brow.route(/^\/?$/, TodosView);
    Brow.route(/^\/?$/, FooterView);
    Brow.route(/^\/(\w+)?$/, TodosView);
    Brow.route(/^\/(\w+)?$/, FooterView);

    // setup templates
    Brow.template('todos', Handlebars.compile(Brow.$('#todos-template').innerHTML));
    Brow.template('footer', Handlebars.compile(Brow.$('#footer-template').innerHTML));

    // load stored data on localStorage or create new
    return JSON.parse(localStorage.getItem('todos-brow')) || [];
  });

})(window.Brow);
