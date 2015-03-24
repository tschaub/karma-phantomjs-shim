# karma-phantomjs-shim

Provides `Function.prototype.bind` when running tests in PhantomJS 1.x.

## Use

Install the plugin with `npm`:

    npm install karma-phantomjs-shim

Configure Karma to load the plugin as a framework:

```js
module.exports = function(config) {
  config.set({
    frameworks: ['phantomjs-shim']
    // additional settings here ...
  });
};
```
