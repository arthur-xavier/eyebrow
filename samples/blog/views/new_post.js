(function(Brow) {
  "use strict";

  var new_post = function(store) {
    //
    this.new = function() {
      event.preventDefault();
      try {
        store.posts.unshift({
          title: document.post.title.value || 'Untitled',
          author: document.post.author.value || 'Anonymous',
          text: document.post.text.value,
          date: new Date()
        });
        Brow('posts');
      } catch(err) {
        throw err;
      }

      return store;
    };

    Brow.render('new_post');
  };

  Brow.route(/^\/new_post/, new_post);
  
})(window.Brow);
