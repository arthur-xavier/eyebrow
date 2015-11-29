(function(Brow) {
  "use strict";

  var posts = function(store) {
    this.posts = store.posts;
    Brow.render('posts');
  };

  Brow.route(/^\/?$/, posts);
  Brow.route(/^\/posts/, posts);

})(window.Brow);
