(function(Brow) {
  "use strict";

  Brow(function(store) {
    //
    store = JSON.parse(localStorage.getItem('blog-eyebrow')) || [
      {
        title: "Lorem Ipsum",
        author: "Cicero", date: new Date('0045-07-23'),
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      },
      {
        title: "Cras sed",
        author: "Unknown", date: new Date('1944-10-08'),
        text: "Cras sed elit justo. Nunc arcu tortor, consequat sagittis odio vel, consectetur maximus leo. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris quis ultricies enim, ac viverra purus. Donec sed condimentum enim."
      }
    ];

    Brow.route(/^\/about/, function() { Brow.render('about', '#main') });

    Brow.template('about', Handlebars.compile(document.getElementById('about').innerHTML));
    Brow.template('posts', Handlebars.compile(document.getElementById('posts').innerHTML));
    Brow.template('new_post', Handlebars.compile(document.getElementById('new_post').innerHTML));

    return store;
  });

})(window.Brow);
