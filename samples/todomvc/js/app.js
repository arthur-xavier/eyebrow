(function(Brow) {
  'use strict';

  Handlebars.registerHelper('eq', function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
  });

  Brow(function() {
    Brow.route(/^\/?$/, TodosView);
    Brow.route(/^\/(\w+)?$/, TodosView);
    Brow.template('todos', Handlebars.compile(Brow.$('#todos-template').innerHTML));
    Brow.template('footer', Handlebars.compile(Brow.$('#footer-template').innerHTML));
    return JSON.parse(localStorage.getItem('todos-brow')) || [];
  });

})(window.Brow);
