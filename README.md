# eyebrow
> Minimalistic JavaScript view layer architecture

Eyebrow or just Brow is a minimal library for front-end JavaScript application development inspired by React and Redux. It is a simple View library/architecture which bundles together simple templating, view and event management, routing and data/state store in a very minimalistic way.

Apart from the library itself, Eyebrow provides a set of common and good practices which are based on traditional HTML and JavaScript concepts such as event binding on the DOM.

## Installation
To install Eyebrow you can do it either download the `eyebrow.js` file from this repo or install it via NPM or Bower:
```
npm install eyebrow
```
or
```
bower install eyebrow
```
You can then import Eyebrow to your page using [Browserify](https://www.npmjs.com/package/browserify) or a `<script>` tag.

## Principles
### Brow functions
Every view, event or action in Brow is a function of the type
```
f : State × (Data...) → State
```
where `Data...` is a variadic list of arguments which contains data fed to the view/event/action.

When thought of as an action in response to a route, the `Data` argument contains the route parameters, for example: in a blogging application, the route `http://yourblog.com/#/some-author/post-name` could be associated with a function of type:
```
viewPostFromAuthor : State × Author × Post → State
```

Views in Brow are then just functions which are called in response to a route change (see [Routing](#routing) section).

## Functions
### Brow(action[, data])
The core of the library is the `Brow` function. It can be seen as an event emitter. When calling the Brow function, there can be four different cases in following precedence order:

1. **View refresh** – When called with no parameters, `Brow()` refreshes the current view, the view function(s) assigned to the current route are called once again with the same parameters;
2. **View action** – When called with one or both parameters, `Brow(actionName, data...)` tries to call the method `actionName` on the current view with `data...` parameters, if it exposes such method;
3. **Application action** – When no view method for `actionName` is found, `Brow(actionName, data...)` emits an event of name `actionName`, which, when registered by the application with `Brow.on(actionName, callback)`, calls such event callback;
4. **Route action** – Last but not least, when none of the above cases is met before, when no method for `actionName` is found, then `actionName` is treated as a route `route`. The window hash is set to `route` and the views whose registered RegExp match `route` are called.

### Views
In Brow - as stated before -, views are just functions of the type `State × (Data...) → State`, that is, any function which, given a State and a set of input data, calculates a new application State.

Brow view functions must be pure, they shall not produce any side effects. Given the same State and Data input, it should calculate the same output State, because only when the State returned by the view function is different from the last state, the view gets refreshed.

### Templating
Templating in Brow is left to the user himself to decide what's better to use. Templates are just functions registered under a name on Brow with the function:
```
Brow.template : String × Function → [(String, Function)]
```

In the examples, mainly Handlebars templates are used, but you can also set it up to use custom functions, *e.g.*:
```javascript
Brow.template('my_template', (items) => {
  return items.map((item) => `<li class="${item.active ? 'active' : ''}">${item.name}</li>`);
});
```

In order to render a template, the `Brow.render` function must be used, *e.g.*:
```javascript
Brow.render('my_template', 'div#main', exampleItems);
```

### Routing
Routing in Brow is done by watching the `location.hash` property. When of the `onhashchange` event, the registered routes are matched against the new hash.

Routes can be registered with the function
```
Brow.route : RegExp × Function → [(RegExp, Function)]
```
which registers a regular expression as a route. The whole `location.hash` (without the # character) is matched against the given RegExp. And the given view function must be of type `State × (Data...) → State`.

## TODO
- [ ] Create a Chat example application
- [ ] Develop a component oriented approach
- [ ] Publish to Bower
- [x] Publish to NPM
