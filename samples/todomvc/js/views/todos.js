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
          store[utils.findTodoIndexById(store, id)].title = val;
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
      store.splice(utils.findTodoIndexById(store, id), 1);
      Brow();
    };

    /**
     * Marks a todo as completed
     * @param {Array}  store
     * @param {string} id
     */
    this.mark = function(store, id) {
      store[utils.findTodoIndexById(store, id)].completed ^= true;
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


    // setup render context
    this.todos = store;

    // filter todos
    if(filter === 'active') {
      this.todos = this.todos.filter(function(t) { return !t.completed; });
    } else if(filter === 'completed') {
      this.todos = this.todos.filter(function(t) { return t.completed; });
    }

    // show/hide main section
    Brow.$('#main').style.display = (this.todos.length > 0) ? 'inherit' : 'none';

    // render templates
    Brow.render('todos', this);
    
    // store data
    localStorage.setItem('todos-brow', JSON.stringify(store));
  };

  window.TodosView = TodosView;

})(window.Brow);
