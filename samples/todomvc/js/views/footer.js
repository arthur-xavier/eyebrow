(function(Brow) {
  'use strict';

  /**
   * Footer View
   * @param {Array}  store  Stored todos
   * @param {string} filter
   */
  var FooterView = function(store, filter) {

    /** 
     * Removes all completed todos from the list
     * Called on click event of button#clear-completed
     * @param  {Array} store
     * @return {Array} new store with completed todos removed
     */
    this.clear_completed = this.clear_completed || function(store) {
      return store.filter(function(todo) { return !todo.completed; });
    };


    // setup render context
    this.filter = filter;

    var active = store.filter(function(t) { return !t.completed; });
    var completed = store.filter(function(t) { return t.completed; });

    this.activeTodoCount = active.length;
    this.activeTodoWord = (this.activeTodoCount == 1) ? "todo" : "todos";

    this.completedTodos = completed.length > 0;

    // show/hide footer
    Brow.$('#footer').style.display = (store.length > 0) ? 'inherit' : 'none';

    // render templates
    Brow.render('footer', this, '#footer');

    // store data
    localStorage.setItem('todos-brow', JSON.stringify(store));
  };

  window.FooterView = FooterView;

})(window.Brow);
