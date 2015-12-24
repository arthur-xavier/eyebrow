/* jshint esnext: true */
/* globals Brow */
(function(Brow) {
  "use strict";

  const KEY_ENTER = 13;
  const KEY_ESCAPE = 27;

  /**
   * Main View
   * @param {Array}  store  Stored todos
   * @param {string} filter
   */
  let TodosView = function(store, filter) {
    // setup render context
    this.filter = filter;
    this.todos = store;

    var active = store.filter((t) => !t.completed);
    var completed = store.filter((t) => t.completed);

    this.activeTodoCount = active.length;
    this.activeTodoWord = (this.activeTodoCount == 1) ? "todo" : "todos";

    this.completedTodos = completed.length > 0;

    // filter todos
    if(this.filter === 'active') {
      this.todos = this.todos.filter((t) => !t.completed);
    } else if(this.filter === 'completed') {
      this.todos = this.todos.filter((t) => t.completed);
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

  // create :: [Todos] -> Event -> [Todos]
  TodosView.create = (store, event) => {
    var $input = event.target;
    var val = $input.value.trim();
    if(!val || event.which !== KEY_ENTER) {
      return store;
    }

    $input.value = "";

    return [
      {
        id: utils.uuid(),
        title: val,
        completed: false
      },
      ...store
    ];
  };

  // edit :: [Todos] -> String -> ()
  TodosView.edit = (store, id) => {
    var item = document.querySelector('[data-id="' + id + '"');
    item.className += ' editing';
    item.querySelector('.edit').focus();
  };

  // keyup :: [Todos] -> Event -> ()
  TodosView.keyup = (store, event) => {
    var $input = event.target;
    if(event.which === KEY_ENTER) {
      $input.dataset.abort = false;
      $input.blur();
    } else if(event.which === KEY_ESCAPE) {
      $input.dataset.abort = true;
      $input.blur();
    }
  };

  // update :: [Todo] -> String -> [Todo]
  TodosView.update = (store, id) => {
    var $input = event.target;
    var val = $input.value;

    if($input.dataset.abort === 'false') {
      if(val) {
        return store.map((todo) => todo.id === id ? Object.assign(todo, { title: val, editing: false }) : todo);
      } else {
        return TodosView.destroy(store, id);
      }
    } else {
      $input.dataset.abort = false;
      return store.map((todo) => todo.id === id ? Object.assign(todo, { editing: false }) : todo);
    }
  };

  // destroy :: [Todo] -> String -> [Todo]
  TodosView.destroy = (store, id) => store.filter((todo) => todo.id !== id);

  // mark :: [Todo] -> String -> [Todo]
  TodosView.mark = (store, id) => store.map((todo) => todo.id === id ? Object.assign(todo, { completed: todo.completed ^ true }) : todo);

  // mark_all :: [Todo] -> Event -> [Todo]
  TodosView.mark_all = (store, event) => store.map((todo) => Object.assign(todo, { completed: event.target.checked }));

  // clear_completed :: [Todo] -> [Todo]
  TodosView.clear_completed = (store) => store.filter((todo) => !todo.completed);

  window.TodosView = TodosView;
})(Brow);
