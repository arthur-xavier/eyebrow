# Eyebrow
> Minimalistic JavaScript single-page web library

Eyebrow or just Brow is a minimal single-page web library for front-end JavaScript inspired by React and the Flux architecture. It is a simple View library which bundles together simple templating, view and event management, routing and data/state store in a very minimalistic way. 

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
Every view, event or action in Brow is a function of the form `f : State × Data →  State` where `Data` is a variadic list of arguments which contains data fed to the view/event/action.

When thought of as an action in response to a route, the `Data` argument contains the route parameters.

For example, in a blogging application, the route `/some-author/post-name` could be associated with a function of type `function viewPostFromAuthor(state, author, post)`.

Views in Brow are then just functions which are called in response to a route change (see [Routing](#routing) section) .

## Functions
### Brow(action[, data])
The core of the library is the `Brow` function. It can be seen as an event emmiter. When calling the Brow function, there can be four different cases in following precedence order:
 
1. **View refresh** – 
2. **View action** – 
3. **Application action** –
4. **Route action** –

### Views

### Templating

### Routing

## TODO