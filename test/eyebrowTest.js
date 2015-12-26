var Eyebrow = require('../');
require('chai').should();

describe("Eyebrow", function() {

  var identity = function(x) { return x; };

  var App;
  var template;
  var setHeader;
  var view, view2;

  it("should create an application", function() {
    App = new Eyebrow();
    App.routes.should.eql([]);
    App.templates.should.eql({});
    App.actions.should.eql({});
  });

  describe("application", function() {
    it("should initialize", function(done) {
      App(function() {
        this.should.equal(App);
        done();
      });
    });

    it("should register templates", function() {
      template = function(data) { return "<h1>" + data.header + "</h1>"; };
      App.template('test', template);
      App.templates.should.eql({ test: template });
    });

    it("should register actions", function() {
      setHeader = function(text) { identity(text); };
      App.on('setHeader', setHeader);
      App.actions.should.eql({ setHeader: setHeader });
    });

    it("should register routes", function() {
      view = function(store) {
        App.render('test', '#test', { header: store });
        return "view -> " + store;
      };
      App.route(/\/test$/, view);
      App.routes.should.eql([{ regexp: /\/test$/, view: view }]);
    });

    it("should register strings as routes", function() {
      view2 = function(store, text) {
        App.render('test', '#header', { header: text });
        return "view2 -> " + store;
      };
      App.route('/head/:text', view2);
      App.routes.should.eql([{ regexp: /\/test$/, view: view }, { regexp: /\/head\/(.+)$/, view: view2 }]);
    });


    describe("templates", function() {
      it("should render to DOM elements", function() {
        var div = { innerHTML: "" };
        App.render('test', div, { header: "Lorem ipsum" });
        div.innerHTML.should.equal("<h1>Lorem ipsum</h1>");
      });

      it("should return the rendered template when no selector or DOM element is passed", function() {
        App.render('test', null, { header: "Lorem ipsum" }).should.equal("<h1>Lorem ipsum</h1>");
      });
    });

    describe("routes", function() {
      before(function() {
        App.routes = [];
        global.event = { preventDefault: identity };
      });

      it("should load views on hash change", function(done) {
        global.location = { hash: '#/head/Testing' };
        App.route('/head/:text', function() { done(); });
        App._loadViewFromHash();
      });

      it("should throw an error when an undefined view function is passed", function(done) {
        App.route('/error');
        try {
          global.location = { hash: '#/error' };
          App._loadViewFromHash();
        } catch(err) {
          err.message.should.equal("Eyebrow: view function is undefined");
          done();
        }
      });
    });

    describe("views", function() {
      before(function() {
        App.routes = [];
        global.event = { preventDefault: identity };
      });

      it("should load view parameters from hash", function(done) {
        global.location = { hash: '#/test/post-about-tests' };
        App.route('/:category/:post', function(store, category, post) {
          category.should.equal('test');
          post.should.equal('post-about-tests');
          done();
        });
        App._loadViewFromHash();
      });

      it("should modify the state of the application", function(done) {
        global.location = null;
        App.route('/test', function(store) { return "test"; });
        App._loadViewFromHash('/test');
        App.route('/verify', function(store) {
          store.should.equal("test");
          done();
        });
        App._loadViewFromHash('/verify');
      });
    });

    describe("application function", function() {
      before(function() {
        global.location = null;
      });

      it("should reload views", function() {
        var counter = 0;
        App.route('/inc', function() { counter++; });
        App._loadViewFromHash('/inc');
        counter.should.equal(1);
        App();
        counter.should.equal(2);
      });

      it("should call view functions", function() {
        var counter = 0;

        App.route('/f', function(store) {
          this.inc = function() { counter++; };
        });
        App._loadViewFromHash('/f');

        App('inc');
        counter.should.equal(1);
        App('inc');
        counter.should.equal(2);
      });

      it("should call view functions with multiple arguments", function() {
        var args = [];

        App.route('/g', function() {
          this.function = function(store, a, b) {
            args = [a, b];
          };
        });
        App._loadViewFromHash('/g');

        App('function', 1, 2);
        args.should.eql([1, 2]);
      });

      it("should call actions", function(done) {
        App.on('done', function() { done(); });
        App('done');
      });

      it("should call actions with multiple arguments", function(done) {
        App.on('action', function(store, a, b) {
          a.should.equal(1);
          b.should.equal(2);
          done();
        });
        App('action', 1, 2);
      });

      it("should change location.hash", function() {
        global.location = { hash: "" };
        App('test').should.equal(true);
        global.location.hash.should.equal('/test');
      });

      it("should update view on store changes", function() {
        var counter = 0;
        global.location = null;
        App.route('/counter', function() {
          this.inc = function() { return ++counter; };
          return counter;
        });
        App._loadViewFromHash('/counter');
        counter.should.equal(0);
        App('inc').should.equal(true);
        counter.should.equal(1);
      });

      it("should load template parameters from view object", function(done) {
        App.route('/view', function() {
          this.header = "View";
          App.render('test').should.equal("<h1>View</h1>");
          done();
        });
        App._loadViewFromHash('/view');
      });
    });
  });
});
