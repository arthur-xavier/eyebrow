(function(Brow) {
  "use strict";

  var search = function(store, data, author) {
    try {
      // (author)? ==> search by author
      if(!!author) {
        this.posts = store.posts.filter(function(post) {
          return post.author == author;
        });
      // else search by text
      } else {
        this.posts = store.posts.filter(function(post) {
          var match = post.text.match(new RegExp(data, 'gi'));
          return match && match.length > 0;
        });
      }
    } catch(err) {
      throw err;
    }

    Brow.render('posts');
  };

  document.searchForm.onsubmit = function() {
    event.preventDefault();
    Brow('search/' + document.searchForm.search.value);
    return false;
  };

  Brow.route(/^\/search\/(\w+)\/?$/, search);
  Brow.route(/^\/search\/(author)\/(\w+)\/?$/, search);

})(window.Brow);
