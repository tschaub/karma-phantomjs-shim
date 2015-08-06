/**
 * Adapted from https://github.com/Raynos/function-bind
 * Copyright 2013 Raynos.
 * MIT license, see license.md for detail.
 */

(function() {
  if (Function.prototype.bind) {
    return;
  }

  var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
  var slice = Array.prototype.slice;
  var toStr = Object.prototype.toString;
  var funcType = '[object Function]';

  Function.prototype.bind = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
      throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice.call(arguments, 1);

    var binder = function () {
      if (this instanceof bound) {
        var result = target.apply(this, args.concat(slice.call(arguments)));
        if (Object(result) === result) {
          return result;
        }
        return this;
      } else {
        return target.apply(that, args.concat(slice.call(arguments)));
      }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
      boundArgs.push('$' + i);
    }

    var bound = Function('binder', 'return function (' + boundArgs.join(',') +
          '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
      var Empty = function Empty() {};
      Empty.prototype = target.prototype;
      bound.prototype = new Empty();
      Empty.prototype = null;
    }

    return bound;
  };

}());

/**
 * Polyfill for requestAnimationFrame
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 * http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 * requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
 * MIT license
 */
(function() {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
      || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }
  if(!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() {
          callback(currTime + timeToCall);
        },
        timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  if(!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
}());

/*
 * Polyfill for CustomEvent
 * Until PhantomJS v2.0 is out (see https://github.com/ariya/phantomjs/issues/11289)
 */
(function() {
  function CustomEvent(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  };

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();