/* globals Eyebrow, TodosView */
var TodoApp = Eyebrow();

TodoApp(function() {
  // setup routes
  this.route(/^\/?$/, TodosView);
  this.route(/^\/(\w+)?$/, TodosView);

  // setup templates
  this.template('todos', Handlebars.compile(document.getElementById('todos-template').innerHTML));
  this.template('footer', Handlebars.compile(document.getElementById('footer-template').innerHTML));

  // load stored data on localStorage or create new
  return JSON.parse(localStorage.getItem('todos-brow')) || [];
});
