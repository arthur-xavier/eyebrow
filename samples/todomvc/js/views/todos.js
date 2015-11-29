(function(Brow) {
  'use strict';

  var KEY_ENTER = 13,
      KEY_ESCAPE = 27;

  var TodosView = function(store, filter) {
    // view events
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
    };

    this.edit = function(store, id) {
      var item = Brow.$('[data-id="' + id + '"');
      item.className += ' editing';
      Brow.$('.edit', item).focus();
    };

    this.keyup = function() {
      if(event.which === KEY_ENTER) {
        event.target.dataset.abort = false;
        event.target.blur();
      } else if(event.which === KEY_ESCAPE) {
        event.target.dataset.abort = true;
        event.target.blur();
      }
    };

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
    };

    this.destroy = function(store, id) {
      store.splice(utils.findTodoIndexById(id), 1);
    };

    this.mark = function(store, id) {
      var i = utils.findTodoIndexById(id);
      store[i].completed = !store[i].completed;
    };

    this.mark_all = function(store) {
      store.forEach(function(t) { t.completed = event.target.checked; });
    };

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
