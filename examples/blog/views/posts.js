var posts = function(store) {
  this.posts = store;
  Brow.render('posts', '#main');
};

Brow.route(/^\/?$/, posts);
Brow.route(/^\/posts/, posts);
