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
    this.create = this.create || function(store) {
      var $input = event.target;
      var val = $input.value.trim();

      if(event.which !== KEY_ENTER || !val) {
        return;
      }
      
      $input.value = "";

      store.unshift({
        id: utils.uuid(),
        title: val,
        completed: false
      });
      return store.slice();
    };

    /**
     * Displays edit input field for todo
     * Called on dblclick event of label
     * @param {Array}  store
     * @param {string} id
     */
    this.edit = this.edit || function(store, id) {
      var item = document.querySelector('[data-id="' + id + '"');
      item.className += ' editing';
      item.querySelector('.edit').focus();
    };

    /**
     * Checks for Enter or Escape key presses
     * If Escape key is pressed, cancel the todo edition
     * If Enter key is pressed, update the todo
     * Called on keyup event of input.edit
     */
    this.keyup = this.keyup || function() {
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
    this.update = this.update || function(store, id) {
      var $input = event.target;
      var val = $input.value;

      if($input.dataset.abort === 'false') {
        if(val) {
          store[utils.findTodoIndexById(store, id)].title = val;
        } else {
          this.destroy(store, id);
        }
      } else {
        $input.dataset.abort = false;
      }

      return store.slice();
    };

    /**
     * Removes a todo from the list
     * Called on click event of button.destroy
     * @param {Array}  store
     * @param {string} id
     */
    this.destroy = this.destroy || function(store, id) {
      return store.filter(function(todo) { return todo.id !== id; });
    };

    /**
     * Marks a todo as completed
     * @param {Array}  store
     * @param {string} id
     */
    this.mark = this.mark || function(store, id) {
      return store.map(function(todo) {
        if(todo.id === id) todo.completed ^= true;
        return todo;
      });
    };

    /**
     * Marks all todos as completed
     * Called on change event of input#toggle-all
     * @param {Array} store
     */
    this.mark_all = this.mark_all || function(store) {
      return store.map(function(todo) {
        todo.completed = event.target.checked;
        return todo;
      });
    };

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
    this.todos = store;

    var active = store.filter(function(t) { return !t.completed; });
    var completed = store.filter(function(t) { return t.completed; });

    this.activeTodoCount = active.length;
    this.activeTodoWord = (this.activeTodoCount == 1) ? "todo" : "todos";

    this.completedTodos = completed.length > 0;

    // filter todos
    if(this.filter === 'active') {
      this.todos = this.todos.filter(function(t) { return !t.completed; });
    } else if(this.filter === 'completed') {
      this.todos = this.todos.filter(function(t) { return t.completed; });
    }

    // show/hide main section and footer
    document.getElementById('main').style.display = (this.todos.length > 0) ? 'inherit' : 'none';
    document.getElementById('footer').style.display = (store.length > 0) ? 'inherit' : 'none';

    // render templates
    Brow.render('todos', '#todo-list');
    Brow.render('footer', '#footer');
    
    // store data
    localStorage.setItem('todos-brow', JSON.stringify(store));
  };

  window.TodosView = TodosView;

})(window.Brow);
