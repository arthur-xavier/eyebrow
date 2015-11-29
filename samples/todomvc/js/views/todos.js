(function(Brow) {
  'use strict';

  var KEY_ENTER = 13,
      KEY_ESCAPE = 27;

  /**
   * Main View
   * @param {Array}  store  Stored todos
   * @param {string} filter
   */
  var TodosView = function(store, filter) {

    /**
     * Creates a new Todo and adds it to store
     * Called on keyup event of input#new-todo
     * @param {Array} store
     */
    this.create = function(store) {
      var $input = event.target;
      var val = $input.value.trim();

      if(event.which !== KEY_ENTER || !val) {
        return;
      }

      store.unshift({
        id: utils.uuid(),
        title: val,
        completed: false
      });
      $input.value = "";

      Brow();
    };

    /**
     * Displays edit input field for todo
     * Called on dblclick event of label
     * @param {Array}  store
     * @param {string} id
     */
    this.edit = function(store, id) {
      var item = Brow.$('[data-id="' + id + '"');
      item.className += ' editing';
      Brow.$('.edit', item).focus();
    };

    /**
     * Checks for Enter or Escape key presses
     * If Escape key is pressed, cancel the todo edition
     * If Enter key is pressed, update the todo
     * Called on keyup event of input.edit
     */
    this.keyup = function() {
      var $input = event.target;

      if(event.which === KEY_ENTER) {
        $input.dataset.abort = false;
        $input.blur();
      } else if(event.which === KEY_ESCAPE) {
        $input.dataset.abort = true;
        $input.blur();
      }
    };

    /**
     * Updates the title of a todo
     * Called on focusout event of input.edit
     * @param {Array}  store
     * @param {string} id
     */
    this.update = function(store, id) {
      var $input = event.target;
      var val = $input.value;

      if($input.dataset.abort === 'false') {
        if(val) {
          store[utils.findTodoIndexById(id)].title = val;
        } else {
          this.destroy(store, id);
        }
      } else {
        $input.dataset.abort = false;
      }

      Brow();
    };

    /**
     * Removes a todo from the list
     * Called on click event of button.destroy
     * @param {Array}  store
     * @param {string} id
     */
    this.destroy = function(store, id) {
      store.splice(utils.findTodoIndexById(id), 1);
      Brow();
    };

    /**
     * Marks a todo as completed
     * @param {Array}  store
     * @param {string} id
     */
    this.mark = function(store, id) {
      store[utils.findTodoIndexById(id)].completed ^= true;
      Brow();
    };

    /**
     * Marks all todos as completed
     * Called on change event of input#toggle-all
     * @param {Array} store
     */
    this.mark_all = function(store) {
      store.forEach(function(t) { t.completed = event.target.checked; });
      Brow();
    };

    /** 
     * Removes all completed todos from the list
     * Called on click event of button#clear-completed
     * @param  {Array} store
     * @return {Array} new store with completed todos removed
     */
    this.clear_completed = function(store) {
      return store.filter(function(t) { return !t.completed; });
    };


    // setup render context
    this.filter = filter || this.filter;
    this.todos = store;

    var active = this.todos.filter(function(t) { return !t.completed; });
    var completed = this.todos.filter(function(t) { return t.completed; });

    this.activeTodoCount = active.length;
    this.activeTodoWord = (this.activeTodoCount == 1) ? "todo" : "todos";

    this.completedTodos = completed.length > 0;

    // filter todos
    if(this.filter === 'active') {
      this.todos = active;
    } else if(this.filter === 'completed') {
      this.todos = completed;
    }

    // show/hide sections
    Brow.$('#main').style.display = (this.todos.length > 0) ? 'inherit' : 'none';
    Brow.$('#footer').style.display = (store.length > 0) ? 'inherit' : 'none';

    // render templates
    Brow.render('todos');
    Brow.render('footer', '#footer');
    
    // store data
    localStorage.setItem('todos-brow', JSON.stringify(store));
  };

  window.TodosView = TodosView;

})(window.Brow);
