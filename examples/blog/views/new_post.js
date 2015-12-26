var new_post = function(store) {
  //
  this.new = function() {
    event.preventDefault();
    try {
      store.unshift({
        title: document.post.title.value || 'Untitled',
        author: document.post.author.value || 'Anonymous',
        text: document.post.text.value,
        date: new Date()
      });
      localStorage.setItem('blog-eyebrow', JSON.stringify(store));
      Brow('posts');
    } catch(err) {
      throw err;
    }

    return store;
  };

  Brow.render('new_post', '#main');
};

Brow.route(/^\/new_post/, new_post);
