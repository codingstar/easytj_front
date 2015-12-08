(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

var $ = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

// 使用 Amaze UI 源码中的模块
var addToHome = require('amazeui/js/ui.add2home');

// 使用 NPM 中的模块
var detector = require('detector');

$(function() {
  $('#browser-info').append('浏览器信息：<pre>' +
    JSON.stringify(detector.browser) +
    '</pre>'
  );

  addToHome();

  console.log('Hello World. This is Amaze UI Starter Kit.');
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"amazeui/js/ui.add2home":3,"detector":4}],2:[function(require,module,exports){
(function (global){
'use strict';

/* jshint -W040 */

var $ = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

if (typeof $ === 'undefined') {
  throw new Error('Amaze UI 2.x requires jQuery :-(\n' +
  '\u7231\u4e0a\u4e00\u5339\u91ce\u9a6c\uff0c\u53ef\u4f60' +
  '\u7684\u5bb6\u91cc\u6ca1\u6709\u8349\u539f\u2026');
}

var UI = $.AMUI || {};
var $win = $(window);
var doc = window.document;
var $html = $('html');

UI.VERSION = '{{VERSION}}';

UI.support = {};

UI.support.transition = (function() {
  var transitionEnd = (function() {
    // https://developer.mozilla.org/en-US/docs/Web/Events/transitionend#Browser_compatibility
    var element = doc.body || doc.documentElement;
    var transEndEventNames = {
      WebkitTransition: 'webkitTransitionEnd',
      MozTransition: 'transitionend',
      OTransition: 'oTransitionEnd otransitionend',
      transition: 'transitionend'
    };

    for (var name in transEndEventNames) {
      if (element.style[name] !== undefined) {
        return transEndEventNames[name];
      }
    }
  })();

  return transitionEnd && {end: transitionEnd};
})();

UI.support.animation = (function() {
  var animationEnd = (function() {
    var element = doc.body || doc.documentElement;
    var animEndEventNames = {
      WebkitAnimation: 'webkitAnimationEnd',
      MozAnimation: 'animationend',
      OAnimation: 'oAnimationEnd oanimationend',
      animation: 'animationend'
    };

    for (var name in animEndEventNames) {
      if (element.style[name] !== undefined) {
        return animEndEventNames[name];
      }
    }
  })();

  return animationEnd && {end: animationEnd};
})();

/* jshint -W069 */
UI.support.touch = (
('ontouchstart' in window &&
navigator.userAgent.toLowerCase().match(/mobile|tablet/)) ||
(window.DocumentTouch && document instanceof window.DocumentTouch) ||
(window.navigator['msPointerEnabled'] &&
window.navigator['msMaxTouchPoints'] > 0) || //IE 10
(window.navigator['pointerEnabled'] &&
window.navigator['maxTouchPoints'] > 0) || //IE >=11
false);

// https://developer.mozilla.org/zh-CN/docs/DOM/MutationObserver
UI.support.mutationobserver = (window.MutationObserver ||
window.WebKitMutationObserver || null);

// https://github.com/Modernizr/Modernizr/blob/924c7611c170ef2dc502582e5079507aff61e388/feature-detects/forms/validation.js#L20
UI.support.formValidation = (typeof document.createElement('form').
  checkValidity === 'function');

UI.utils = {};

/**
 * Debounce function
 * @param {function} func  Function to be debounced
 * @param {number} wait Function execution threshold in milliseconds
 * @param {bool} immediate  Whether the function should be called at
 *                          the beginning of the delay instead of the
 *                          end. Default is false.
 * @desc Executes a function when it stops being invoked for n seconds
 * @via  _.debounce() http://underscorejs.org
 */
UI.utils.debounce = function(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this;
    var args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    var callNow = immediate && !timeout;

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) {
      func.apply(context, args);
    }
  };
};

UI.utils.isInView = function(element, options) {
  var $element = $(element);
  var visible = !!($element.width() || $element.height()) &&
    $element.css('display') !== 'none';

  if (!visible) {
    return false;
  }

  var windowLeft = $win.scrollLeft();
  var windowTop = $win.scrollTop();
  var offset = $element.offset();
  var left = offset.left;
  var top = offset.top;

  options = $.extend({topOffset: 0, leftOffset: 0}, options);

  return (top + $element.height() >= windowTop &&
  top - options.topOffset <= windowTop + $win.height() &&
  left + $element.width() >= windowLeft &&
  left - options.leftOffset <= windowLeft + $win.width());
};

/* jshint -W054 */
UI.utils.parseOptions = UI.utils.options = function(string) {
  if ($.isPlainObject(string)) {
    return string;
  }

  var start = (string ? string.indexOf('{') : -1);
  var options = {};

  if (start != -1) {
    try {
      options = (new Function('',
        'var json = ' + string.substr(start) +
        '; return JSON.parse(JSON.stringify(json));'))();
    } catch (e) {
    }
  }

  return options;
};

/* jshint +W054 */

UI.utils.generateGUID = function(namespace) {
  var uid = namespace + '-' || 'am-';

  do {
    uid += Math.random().toString(36).substring(2, 7);
  } while (document.getElementById(uid));

  return uid;
};

// @see https://davidwalsh.name/get-absolute-url
UI.utils.getAbsoluteUrl = (function() {
  var a;

  return function(url) {
    if (!a) {
      a = document.createElement('a');
    }

    a.href = url;

    return a.href;
  };
})();

/**
 * Plugin AMUI Component to jQuery
 *
 * @param {String} name - plugin name
 * @param {Function} Component - plugin constructor
 * @param {Object} [pluginOption]
 * @param {String} pluginOption.dataOptions
 * @param {Function} pluginOption.methodCall - custom method call
 * @param {Function} pluginOption.before
 * @param {Function} pluginOption.after
 * @since v2.4.1
 */
UI.plugin = function UIPlugin(name, Component, pluginOption) {
  var old = $.fn[name];
  pluginOption = pluginOption || {};

  $.fn[name] = function(option) {
    var allArgs = Array.prototype.slice.call(arguments, 0);
    var args = allArgs.slice(1);
    var propReturn;
    var $set = this.each(function() {
      var $this = $(this);
      var dataName = 'amui.' + name;
      var dataOptionsName = pluginOption.dataOptions || ('data-am-' + name);
      var instance = $this.data(dataName);
      var options = $.extend({},
        UI.utils.parseOptions($this.attr(dataOptionsName)),
        typeof option === 'object' && option);

      if (!instance && option === 'destroy') {
        return;
      }

      if (!instance) {
        $this.data(dataName, (instance = new Component(this, options)));
      }

      // custom method call
      if (pluginOption.methodCall) {
        pluginOption.methodCall.call($this, allArgs, instance);
      } else {
        // before method call
        pluginOption.before &&
        pluginOption.before.call($this, allArgs, instance);

        if (typeof option === 'string') {
          propReturn = typeof instance[option] === 'function' ?
            instance[option].apply(instance, args) : instance[option];
        }

        // after method call
        pluginOption.after && pluginOption.after.call($this, allArgs, instance);
      }
    });

    return (propReturn === undefined) ? $set : propReturn;
  };

  $.fn[name].Constructor = Component;

  // no conflict
  $.fn[name].noConflict = function() {
    $.fn[name] = old;
    return this;
  };

  UI[name] = Component;
};

// http://blog.alexmaccaw.com/css-transitions
$.fn.emulateTransitionEnd = function(duration) {
  var called = false;
  var $el = this;

  $(this).one(UI.support.transition.end, function() {
    called = true;
  });

  var callback = function() {
    if (!called) {
      $($el).trigger(UI.support.transition.end);
    }
    $el.transitionEndTimmer = undefined;
  };
  this.transitionEndTimmer = setTimeout(callback, duration);
  return this;
};

$.fn.redraw = function() {
  return this.each(function() {
    /* jshint unused:false */
    var redraw = this.offsetHeight;
  });
};

/* jshint unused:true */

$.fn.transitionEnd = function(callback) {
  var endEvent = UI.support.transition.end;
  var dom = this;

  function fireCallBack(e) {
    callback.call(this, e);
    endEvent && dom.off(endEvent, fireCallBack);
  }

  if (callback && endEvent) {
    dom.on(endEvent, fireCallBack);
  }

  return this;
};

$.fn.removeClassRegEx = function() {
  return this.each(function(regex) {
    var classes = $(this).attr('class');

    if (!classes || !regex) {
      return false;
    }

    var classArray = [];
    classes = classes.split(' ');

    for (var i = 0, len = classes.length; i < len; i++) {
      if (!classes[i].match(regex)) {
        classArray.push(classes[i]);
      }
    }

    $(this).attr('class', classArray.join(' '));
  });
};

//
$.fn.alterClass = function(removals, additions) {
  var self = this;

  if (removals.indexOf('*') === -1) {
    // Use native jQuery methods if there is no wildcard matching
    self.removeClass(removals);
    return !additions ? self : self.addClass(additions);
  }

  var classPattern = new RegExp('\\s' +
  removals.
    replace(/\*/g, '[A-Za-z0-9-_]+').
    split(' ').
    join('\\s|\\s') +
  '\\s', 'g');

  self.each(function(i, it) {
    var cn = ' ' + it.className + ' ';
    while (classPattern.test(cn)) {
      cn = cn.replace(classPattern, ' ');
    }
    it.className = $.trim(cn);
  });

  return !additions ? self : self.addClass(additions);
};

// handle multiple browsers for requestAnimationFrame()
// http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
// https://github.com/gnarf/jquery-requestAnimationFrame
UI.utils.rAF = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
      // if all else fails, use setTimeout
    function(callback) {
      return window.setTimeout(callback, 1000 / 60); // shoot for 60 fps
    };
})();

// handle multiple browsers for cancelAnimationFrame()
UI.utils.cancelAF = (function() {
  return window.cancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.oCancelAnimationFrame ||
    function(id) {
      window.clearTimeout(id);
    };
})();

// via http://davidwalsh.name/detect-scrollbar-width
UI.utils.measureScrollbar = function() {
  if (document.body.clientWidth >= window.innerWidth) {
    return 0;
  }

  // if ($html.width() >= window.innerWidth) return;
  // var scrollbarWidth = window.innerWidth - $html.width();
  var $measure = $('<div ' +
  'style="width: 100px;height: 100px;overflow: scroll;' +
  'position: absolute;top: -9999px;"></div>');

  $(document.body).append($measure);

  var scrollbarWidth = $measure[0].offsetWidth - $measure[0].clientWidth;

  $measure.remove();

  return scrollbarWidth;
};

UI.utils.imageLoader = function($image, callback) {
  function loaded() {
    callback($image[0]);
  }

  function bindLoad() {
    this.one('load', loaded);
    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
      var src = this.attr('src');
      var param = src.match(/\?/) ? '&' : '?';

      param += 'random=' + (new Date()).getTime();
      this.attr('src', src + param);
    }
  }

  if (!$image.attr('src')) {
    loaded();
    return;
  }

  if ($image[0].complete || $image[0].readyState === 4) {
    loaded();
  } else {
    bindLoad.call($image);
  }
};

/**
 * https://github.com/cho45/micro-template.js
 * (c) cho45 http://cho45.github.com/mit-license
 */
/* jshint -W109 */
UI.template = function(id, data) {
  var me = UI.template;

  if (!me.cache[id]) {
    me.cache[id] = (function() {
      var name = id;
      var string = /^[\w\-]+$/.test(id) ?
        me.get(id) : (name = 'template(string)', id); // no warnings

      var line = 1;
      var body = ('try { ' + (me.variable ?
      'var ' + me.variable + ' = this.stash;' : 'with (this.stash) { ') +
      "this.ret += '" +
      string.
        replace(/<%/g, '\x11').replace(/%>/g, '\x13'). // if you want other tag, just edit this line
        replace(/'(?![^\x11\x13]+?\x13)/g, '\\x27').
        replace(/^\s*|\s*$/g, '').
        replace(/\n/g, function() {
          return "';\nthis.line = " + (++line) + "; this.ret += '\\n";
        }).
        replace(/\x11-(.+?)\x13/g, "' + ($1) + '").
        replace(/\x11=(.+?)\x13/g, "' + this.escapeHTML($1) + '").
        replace(/\x11(.+?)\x13/g, "'; $1; this.ret += '") +
      "'; " + (me.variable ? "" : "}") + "return this.ret;" +
      "} catch (e) { throw 'TemplateError: ' + e + ' (on " + name +
      "' + ' line ' + this.line + ')'; } " +
      "//@ sourceURL=" + name + "\n" // source map
      ).replace(/this\.ret \+= '';/g, '');
      /* jshint -W054 */
      var func = new Function(body);
      var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '\x22': '&#x22;',
        '\x27': '&#x27;'
      };
      var escapeHTML = function(string) {
        return ('' + string).replace(/[&<>\'\"]/g, function(_) {
          return map[_];
        });
      };

      return function(stash) {
        return func.call(me.context = {
          escapeHTML: escapeHTML,
          line: 1,
          ret: '',
          stash: stash
        });
      };
    })();
  }

  return data ? me.cache[id](data) : me.cache[id];
};
/* jshint +W109 */
/* jshint +W054 */

UI.template.cache = {};

UI.template.get = function(id) {
  if (id) {
    var element = document.getElementById(id);
    return element && element.innerHTML || '';
  }
};

// Dom mutation watchers
UI.DOMWatchers = [];
UI.DOMReady = false;
UI.ready = function(callback) {
  UI.DOMWatchers.push(callback);
  if (UI.DOMReady) {
    // console.log('Ready call');
    callback(document);
  }
};

UI.DOMObserve = function(elements, options, callback) {
  var Observer = UI.support.mutationobserver;
  if (!Observer) {
    return;
  }

  options = $.isPlainObject(options) ?
    options : {childList: true, subtree: true};

  callback = typeof callback === 'function' && callback || function() {
  };

  $(elements).each(function() {
    var element = this;
    var $element = $(element);

    if ($element.data('am.observer')) {
      return;
    }

    try {
      var observer = new Observer(UI.utils.debounce(
        function(mutations, instance) {
        callback.call(element, mutations, instance);
        // trigger this event manually if MutationObserver not supported
        $element.trigger('changed.dom.amui');
      }, 50));

      observer.observe(element, options);

      $element.data('am.observer', observer);
    } catch (e) {
    }
  });
};

$.fn.DOMObserve = function(options, callback) {
  return this.each(function() {
    UI.DOMObserve(this, options, callback);
  });
};

if (UI.support.touch) {
  $html.addClass('am-touch');
}

$(document).on('changed.dom.amui', function(e) {
  var element = e.target;

  // TODO: just call changed element's watcher
  //       every watcher callback should have a key
  //       use like this: <div data-am-observe='key1, key2'>
  //       get keys via $(element).data('amObserve')
  //       call functions store with these keys
  $.each(UI.DOMWatchers, function(i, watcher) {
    watcher(element);
  });
});

$(function() {
  var $body = $('body');

  UI.DOMReady = true;

  // Run default init
  $.each(UI.DOMWatchers, function(i, watcher) {
    watcher(document);
  });

  // watches DOM
  UI.DOMObserve('[data-am-observe]');

  $html.removeClass('no-js').addClass('js');

  UI.support.animation && $html.addClass('cssanimations');

  // iOS standalone mode
  if (window.navigator.standalone) {
    $html.addClass('am-standalone');
  }

  $('.am-topbar-fixed-top').length &&
  $body.addClass('am-with-topbar-fixed-top');

  $('.am-topbar-fixed-bottom').length &&
  $body.addClass('am-with-topbar-fixed-bottom');

  // Remove responsive classes in .am-layout
  var $layout = $('.am-layout');
  $layout.find('[class*="md-block-grid"]').alterClass('md-block-grid-*');
  $layout.find('[class*="lg-block-grid"]').alterClass('lg-block-grid');

  // widgets not in .am-layout
  $('[data-am-widget]').each(function() {
    var $widget = $(this);
    // console.log($widget.parents('.am-layout').length)
    if ($widget.parents('.am-layout').length === 0) {
      $widget.addClass('am-no-layout');
    }
  });
});

module.exports = UI;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
'use strict';

var UI = require('./core');

/* jshint -W101, -W106 */
/**
 * Add to Homescreen v3.2.2
 * (c) 2015 Matteo Spinelli
 * @license: http://cubiq.org/license
 */

// Check for addEventListener browser support (prevent errors in IE<9)
var _eventListener = 'addEventListener' in window;

// Check if document is loaded, needed by autostart
var _DOMReady = false;
if (document.readyState === 'complete') {
  _DOMReady = true;
} else if (_eventListener) {
  window.addEventListener('load', loaded, false);
}

function loaded() {
  window.removeEventListener('load', loaded, false);
  _DOMReady = true;
}

// regex used to detect if app has been added to the homescreen
var _reSmartURL = /\/ath(\/)?$/;
var _reQueryString = /([\?&]ath=[^&]*$|&ath=[^&]*(&))/;

// singleton
var _instance;
function ath(options) {
  _instance = _instance || new ath.Class(options);

  return _instance;
}

// message in all supported languages
ath.intl = {
  en_us: {
    ios: 'To add this web app to the home screen: tap %icon and then <strong>Add to Home Screen</strong>.',
    android: 'To add this web app to the home screen open the browser option menu and tap on <strong>Add to homescreen</strong>. <small>The menu can be accessed by pressing the menu hardware button if your device has one, or by tapping the top right menu icon <span class="ath-action-icon">icon</span>.</small>'
  },

  zh_cn: {
    ios: '如要把应用程式加至主屏幕,请点击%icon, 然后<strong>加至主屏幕</strong>',
    android: 'To add this web app to the home screen open the browser option menu and tap on <strong>Add to homescreen</strong>. <small>The menu can be accessed by pressing the menu hardware button if your device has one, or by tapping the top right menu icon <span class="ath-action-icon">icon</span>.</small>'
  },

  zh_tw: {
    ios: '如要把應用程式加至主屏幕, 請點擊%icon, 然後<strong>加至主屏幕</strong>.',
    android: 'To add this web app to the home screen open the browser option menu and tap on <strong>Add to homescreen</strong>. <small>The menu can be accessed by pressing the menu hardware button if your device has one, or by tapping the top right menu icon <span class="ath-action-icon">icon</span>.</small>'
  }
};

// Add 2 characters language support (Android mostly)
for (var lang in ath.intl) {
  ath.intl[lang.substr(0, 2)] = ath.intl[lang];
}

// default options
ath.defaults = {
  appID: 'org.cubiq.addtohome',		// local storage name (no need to change)
  fontSize: 15,				// base font size, used to properly resize the popup based on viewport scale factor
  debug: false,				// override browser checks
  logging: false,				// log reasons for showing or not showing to js console; defaults to true when debug is true
  modal: false,				// prevent further actions until the message is closed
  mandatory: false,			// you can't proceed if you don't add the app to the homescreen
  autostart: true,			// show the message automatically
  skipFirstVisit: false,		// show only to returning visitors (ie: skip the first time you visit)
  startDelay: 1,				// display the message after that many seconds from page load
  lifespan: 15,				// life of the message in seconds
  displayPace: 1440,			// minutes before the message is shown again (0: display every time, default 24 hours)
  maxDisplayCount: 0,			// absolute maximum number of times the message will be shown to the user (0: no limit)
  icon: true,					// add touch icon to the message
  message: '',				// the message can be customized
  validLocation: [],			// list of pages where the message will be shown (array of regexes)
  onInit: null,				// executed on instance creation
  onShow: null,				// executed when the message is shown
  onRemove: null,				// executed when the message is removed
  onAdd: null,				// when the application is launched the first time from the homescreen (guesstimate)
  onPrivate: null,			// executed if user is in private mode
  privateModeOverride: false,	// show the message even in private mode (very rude)
  detectHomescreen: false		// try to detect if the site has been added to the homescreen (false | true | 'hash' | 'queryString' | 'smartURL')
};

// browser info and capability
var _ua = window.navigator.userAgent;

var _nav = window.navigator;
_extend(ath, {
  hasToken: document.location.hash == '#ath' || _reSmartURL.test(document.location.href) || _reQueryString.test(document.location.search),
  isRetina: window.devicePixelRatio && window.devicePixelRatio > 1,
  isIDevice: (/iphone|ipod|ipad/i).test(_ua),
  isMobileChrome: _ua.indexOf('Android') > -1 && (/Chrome\/[.0-9]*/).test(_ua) && _ua.indexOf("Version") == -1,
  isMobileIE: _ua.indexOf('Windows Phone') > -1,
  language: _nav.language && _nav.language.toLowerCase().replace('-', '_') || ''
});

// falls back to en_us if language is unsupported
ath.language = ath.language && ath.language in ath.intl ? ath.language : 'en_us';

ath.isMobileSafari = ath.isIDevice && _ua.indexOf('Safari') > -1 && _ua.indexOf('CriOS') < 0;
ath.OS = ath.isIDevice ? 'ios' : ath.isMobileChrome ? 'android' : ath.isMobileIE ? 'windows' : 'unsupported';

ath.OSVersion = _ua.match(/(OS|Android) (\d+[_\.]\d+)/);
ath.OSVersion = ath.OSVersion && ath.OSVersion[2] ? +ath.OSVersion[2].replace('_', '.') : 0;

ath.isStandalone = 'standalone' in window.navigator && window.navigator.standalone;
ath.isTablet = (ath.isMobileSafari && _ua.indexOf('iPad') > -1) || (ath.isMobileChrome && _ua.indexOf('Mobile') < 0);

ath.isCompatible = (ath.isMobileSafari && ath.OSVersion >= 6) || ath.isMobileChrome;	// TODO: add winphone

var _defaultSession = {
  lastDisplayTime: 0,			// last time we displayed the message
  returningVisitor: false,	// is this the first time you visit
  displayCount: 0,			// number of times the message has been shown
  optedout: false,			// has the user opted out
  added: false				// has been actually added to the homescreen
};

ath.removeSession = function(appID) {
  try {
    if (!localStorage) {
      throw new Error('localStorage is not defined');
    }

    localStorage.removeItem(appID || ath.defaults.appID);
  } catch (e) {
    // we are most likely in private mode
  }
};

ath.doLog = function(logStr) {
  if (this.options.logging) {
    console.log(logStr);
  }
};

ath.Class = function(options) {
  // class methods
  this.doLog = ath.doLog;

  // merge default options with user config
  this.options = _extend({}, ath.defaults);
  _extend(this.options, options);
  // override defaults that are dependent on each other
  if (this.options.debug) {
    this.options.logging = true;
  }

  // IE<9 so exit (I hate you, really)
  if (!_eventListener) {
    return;
  }

  // normalize some options
  this.options.mandatory = this.options.mandatory && ( 'standalone' in window.navigator || this.options.debug );
  this.options.modal = this.options.modal || this.options.mandatory;
  if (this.options.mandatory) {
    this.options.startDelay = -0.5;		// make the popup hasty
  }
  this.options.detectHomescreen = this.options.detectHomescreen === true ? 'hash' : this.options.detectHomescreen;

  // setup the debug environment
  if (this.options.debug) {
    ath.isCompatible = true;
    ath.OS = typeof this.options.debug == 'string' ? this.options.debug : ath.OS == 'unsupported' ? 'android' : ath.OS;
    ath.OSVersion = ath.OS == 'ios' ? '8' : '4';
  }

  // the element the message will be appended to
  this.container = document.documentElement;

  // load session
  this.session = this.getItem(this.options.appID);
  this.session = this.session ? JSON.parse(this.session) : undefined;

  // user most likely came from a direct link containing our token, we don't need it and we remove it
  if (ath.hasToken && ( !ath.isCompatible || !this.session )) {
    ath.hasToken = false;
    _removeToken();
  }

  // the device is not supported
  if (!ath.isCompatible) {
    this.doLog("Add to homescreen: not displaying callout because device not supported");
    return;
  }

  this.session = this.session || _defaultSession;

  // check if we can use the local storage
  try {
    if (!localStorage) {
      throw new Error('localStorage is not defined');
    }

    localStorage.setItem(this.options.appID, JSON.stringify(this.session));
    ath.hasLocalStorage = true;
  } catch (e) {
    // we are most likely in private mode
    ath.hasLocalStorage = false;

    if (this.options.onPrivate) {
      this.options.onPrivate.call(this);
    }
  }

  // check if this is a valid location
  var isValidLocation = !this.options.validLocation.length;
  for (var i = this.options.validLocation.length; i--;) {
    if (this.options.validLocation[i].test(document.location.href)) {
      isValidLocation = true;
      break;
    }
  }

  // check compatibility with old versions of add to homescreen. Opt-out if an old session is found
  if (this.getItem('addToHome')) {
    this.optOut();
  }

  // critical errors:
  if (this.session.optedout) {
    this.doLog("Add to homescreen: not displaying callout because user opted out");
    return;
  }
  if (this.session.added) {
    this.doLog("Add to homescreen: not displaying callout because already added to the homescreen");
    return;
  }
  if (!isValidLocation) {
    this.doLog("Add to homescreen: not displaying callout because not a valid location");
    return;
  }

  // check if the app is in stand alone mode
  if (ath.isStandalone) {
    // execute the onAdd event if we haven't already
    if (!this.session.added) {
      this.session.added = true;
      this.updateSession();

      if (this.options.onAdd && ath.hasLocalStorage) {	// double check on localstorage to avoid multiple calls to the custom event
        this.options.onAdd.call(this);
      }
    }

    this.doLog("Add to homescreen: not displaying callout because in standalone mode");
    return;
  }

  // (try to) check if the page has been added to the homescreen
  if (this.options.detectHomescreen) {
    // the URL has the token, we are likely coming from the homescreen
    if (ath.hasToken) {
      _removeToken();		// we don't actually need the token anymore, we remove it to prevent redistribution

      // this is called the first time the user opens the app from the homescreen
      if (!this.session.added) {
        this.session.added = true;
        this.updateSession();

        if (this.options.onAdd && ath.hasLocalStorage) {	// double check on localstorage to avoid multiple calls to the custom event
          this.options.onAdd.call(this);
        }
      }

      this.doLog("Add to homescreen: not displaying callout because URL has token, so we are likely coming from homescreen");
      return;
    }

    // URL doesn't have the token, so add it
    if (this.options.detectHomescreen == 'hash') {
      history.replaceState('', window.document.title, document.location.href + '#ath');
    } else if (this.options.detectHomescreen == 'smartURL') {
      history.replaceState('', window.document.title, document.location.href.replace(/(\/)?$/, '/ath$1'));
    } else {
      history.replaceState('', window.document.title, document.location.href + (document.location.search ? '&' : '?' ) + 'ath=');
    }
  }

  // check if this is a returning visitor
  if (!this.session.returningVisitor) {
    this.session.returningVisitor = true;
    this.updateSession();

    // we do not show the message if this is your first visit
    if (this.options.skipFirstVisit) {
      this.doLog("Add to homescreen: not displaying callout because skipping first visit");
      return;
    }
  }

  // we do no show the message in private mode
  if (!this.options.privateModeOverride && !ath.hasLocalStorage) {
    this.doLog("Add to homescreen: not displaying callout because browser is in private mode");
    return;
  }

  // all checks passed, ready to display
  this.ready = true;

  if (this.options.onInit) {
    this.options.onInit.call(this);
  }

  if (this.options.autostart) {
    this.doLog("Add to homescreen: autostart displaying callout");
    this.show();
  }
};

ath.Class.prototype = {
  // event type to method conversion
  events: {
    load: '_delayedShow',
    error: '_delayedShow',
    orientationchange: 'resize',
    resize: 'resize',
    scroll: 'resize',
    click: 'remove',
    touchmove: '_preventDefault',
    transitionend: '_removeElements',
    webkitTransitionEnd: '_removeElements',
    MSTransitionEnd: '_removeElements'
  },

  handleEvent: function(e) {
    var type = this.events[e.type];
    if (type) {
      this[type](e);
    }
  },

  show: function(force) {
    // in autostart mode wait for the document to be ready
    if (this.options.autostart && !_DOMReady) {
      setTimeout(this.show.bind(this), 50);
      // we are not displaying callout because DOM not ready, but don't log that because
      // it would log too frequently
      return;
    }

    // message already on screen
    if (this.shown) {
      this.doLog("Add to homescreen: not displaying callout because already shown on screen");
      return;
    }

    var now = Date.now();
    var lastDisplayTime = this.session.lastDisplayTime;

    if (force !== true) {
      // this is needed if autostart is disabled and you programmatically call the show() method
      if (!this.ready) {
        this.doLog("Add to homescreen: not displaying callout because not ready");
        return;
      }

      // we obey the display pace (prevent the message to popup too often)
      if (now - lastDisplayTime < this.options.displayPace * 60000) {
        this.doLog("Add to homescreen: not displaying callout because displayed recently");
        return;
      }

      // obey the maximum number of display count
      if (this.options.maxDisplayCount && this.session.displayCount >= this.options.maxDisplayCount) {
        this.doLog("Add to homescreen: not displaying callout because displayed too many times already");
        return;
      }
    }

    this.shown = true;

    // increment the display count
    this.session.lastDisplayTime = now;
    this.session.displayCount++;
    this.updateSession();

    // try to get the highest resolution application icon
    if (!this.applicationIcon) {
      if (ath.OS == 'ios') {
        this.applicationIcon = document.querySelector('head link[rel^=apple-touch-icon][sizes="152x152"],head link[rel^=apple-touch-icon][sizes="144x144"],head link[rel^=apple-touch-icon][sizes="120x120"],head link[rel^=apple-touch-icon][sizes="114x114"],head link[rel^=apple-touch-icon]');
      } else {
        this.applicationIcon = document.querySelector('head link[rel^="shortcut icon"][sizes="196x196"],head link[rel^=apple-touch-icon]');
      }
    }

    var message = '';

    if (typeof this.options.message == 'object' && ath.language in this.options.message) {		// use custom language message
      message = this.options.message[ath.language][ath.OS];
    } else if (typeof this.options.message == 'object' && ath.OS in this.options.message) {		// use custom os message
      message = this.options.message[ath.OS];
    } else if (this.options.message in ath.intl) {				// you can force the locale
      message = ath.intl[this.options.message][ath.OS];
    } else if (this.options.message !== '') {						// use a custom message
      message = this.options.message;
    } else if (ath.OS in ath.intl[ath.language]) {				// otherwise we use our message
      message = ath.intl[ath.language][ath.OS];
    }

    // add the action icon
    message = '<p>' + message.replace('%icon', '<span class="ath-action-icon">icon</span>') + '</p>';

    // create the message container
    this.viewport = document.createElement('div');
    this.viewport.className = 'ath-viewport';
    if (this.options.modal) {
      this.viewport.className += ' ath-modal';
    }
    if (this.options.mandatory) {
      this.viewport.className += ' ath-mandatory';
    }
    this.viewport.style.position = 'absolute';

    // create the actual message element
    this.element = document.createElement('div');
    this.element.className = 'ath-container ath-' + ath.OS + ' ath-' + ath.OS + (ath.OSVersion + '').substr(0, 1) + ' ath-' + (ath.isTablet ? 'tablet' : 'phone');
    this.element.style.cssText = '-webkit-transition-property:-webkit-transform,opacity;-webkit-transition-duration:0s;-webkit-transition-timing-function:ease-out;transition-property:transform,opacity;transition-duration:0s;transition-timing-function:ease-out;';
    this.element.style.webkitTransform = 'translate3d(0,-' + window.innerHeight + 'px,0)';
    this.element.style.transform = 'translate3d(0,-' + window.innerHeight + 'px,0)';

    // add the application icon
    if (this.options.icon && this.applicationIcon) {
      this.element.className += ' ath-icon';
      this.img = document.createElement('img');
      this.img.className = 'ath-application-icon';
      this.img.addEventListener('load', this, false);
      this.img.addEventListener('error', this, false);

      this.img.src = this.applicationIcon.href;
      this.element.appendChild(this.img);
    }

    this.element.innerHTML += message;

    // we are not ready to show, place the message out of sight
    this.viewport.style.left = '-99999em';

    // attach all elements to the DOM
    this.viewport.appendChild(this.element);
    this.container.appendChild(this.viewport);

    // if we don't have to wait for an image to load, show the message right away
    if (this.img) {
      this.doLog("Add to homescreen: not displaying callout because waiting for img to load");
    } else {
      this._delayedShow();
    }
  },

  _delayedShow: function(e) {
    setTimeout(this._show.bind(this), this.options.startDelay * 1000 + 500);
  },

  _show: function() {
    var that = this;

    // update the viewport size and orientation
    this.updateViewport();

    // reposition/resize the message on orientation change
    window.addEventListener('resize', this, false);
    window.addEventListener('scroll', this, false);
    window.addEventListener('orientationchange', this, false);

    if (this.options.modal) {
      // lock any other interaction
      document.addEventListener('touchmove', this, true);
    }

    // Enable closing after 1 second
    if (!this.options.mandatory) {
      setTimeout(function() {
        that.element.addEventListener('click', that, true);
      }, 1000);
    }

    // kick the animation
    setTimeout(function() {
      that.element.style.webkitTransitionDuration = '1.2s';
      that.element.style.transitionDuration = '1.2s';
      that.element.style.webkitTransform = 'translate3d(0,0,0)';
      that.element.style.transform = 'translate3d(0,0,0)';
    }, 0);

    // set the destroy timer
    if (this.options.lifespan) {
      this.removeTimer = setTimeout(this.remove.bind(this), this.options.lifespan * 1000);
    }

    // fire the custom onShow event
    if (this.options.onShow) {
      this.options.onShow.call(this);
    }
  },

  remove: function() {
    clearTimeout(this.removeTimer);

    // clear up the event listeners
    if (this.img) {
      this.img.removeEventListener('load', this, false);
      this.img.removeEventListener('error', this, false);
    }

    window.removeEventListener('resize', this, false);
    window.removeEventListener('scroll', this, false);
    window.removeEventListener('orientationchange', this, false);
    document.removeEventListener('touchmove', this, true);
    this.element.removeEventListener('click', this, true);

    // remove the message element on transition end
    this.element.addEventListener('transitionend', this, false);
    this.element.addEventListener('webkitTransitionEnd', this, false);
    this.element.addEventListener('MSTransitionEnd', this, false);

    // start the fade out animation
    this.element.style.webkitTransitionDuration = '0.3s';
    this.element.style.opacity = '0';
  },

  _removeElements: function() {
    this.element.removeEventListener('transitionend', this, false);
    this.element.removeEventListener('webkitTransitionEnd', this, false);
    this.element.removeEventListener('MSTransitionEnd', this, false);

    // remove the message from the DOM
    this.container.removeChild(this.viewport);

    this.shown = false;

    // fire the custom onRemove event
    if (this.options.onRemove) {
      this.options.onRemove.call(this);
    }
  },

  updateViewport: function() {
    if (!this.shown) {
      return;
    }

    this.viewport.style.width = window.innerWidth + 'px';
    this.viewport.style.height = window.innerHeight + 'px';
    this.viewport.style.left = window.scrollX + 'px';
    this.viewport.style.top = window.scrollY + 'px';

    var clientWidth = document.documentElement.clientWidth;

    this.orientation = clientWidth > document.documentElement.clientHeight ? 'landscape' : 'portrait';

    var screenWidth = ath.OS == 'ios' ? this.orientation == 'portrait' ? screen.width : screen.height : screen.width;
    this.scale = screen.width > clientWidth ? 1 : screenWidth / window.innerWidth;

    this.element.style.fontSize = this.options.fontSize / this.scale + 'px';
  },

  resize: function() {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(this.updateViewport.bind(this), 100);
  },

  updateSession: function() {
    if (ath.hasLocalStorage === false) {
      return;
    }

    if (localStorage) {
      localStorage.setItem(this.options.appID, JSON.stringify(this.session));
    }
  },

  clearSession: function() {
    this.session = _defaultSession;
    this.updateSession();
  },

  getItem: function(item) {
    try {
      if (!localStorage) {
        throw new Error('localStorage is not defined');
      }

      return localStorage.getItem(item);
    } catch (e) {
      // Preventing exception for some browsers when fetching localStorage key
      ath.hasLocalStorage = false;
    }
  },

  optOut: function() {
    this.session.optedout = true;
    this.updateSession();
  },

  optIn: function() {
    this.session.optedout = false;
    this.updateSession();
  },

  clearDisplayCount: function() {
    this.session.displayCount = 0;
    this.updateSession();
  },

  _preventDefault: function(e) {
    e.preventDefault();
    e.stopPropagation();
  }
};

// utility
function _extend(target, obj) {
  for (var i in obj) {
    target[i] = obj[i];
  }

  return target;
}

function _removeToken() {
  if (document.location.hash == '#ath') {
    history.replaceState('', window.document.title, document.location.href.split('#')[0]);
  }

  if (_reSmartURL.test(document.location.href)) {
    history.replaceState('', window.document.title, document.location.href.replace(_reSmartURL, '$1'));
  }

  if (_reQueryString.test(document.location.search)) {
    history.replaceState('', window.document.title, document.location.href.replace(_reQueryString, '$2'));
  }
}

/* jshint +W101, +W106 */

ath.VERSION = '3.2.2';

module.exports = UI.addToHomescreen = ath;

},{"./core":2}],4:[function(require,module,exports){
(function (process){

var detector = {};
var NA_VERSION = "-1";
var win = this;
var external;
var re_msie = /\b(?:msie |ie |trident\/[0-9].*rv[ :])([0-9.]+)/;
var re_blackberry_10 = /\bbb10\b.+?\bversion\/([\d.]+)/;
var re_blackberry_6_7 = /\bblackberry\b.+\bversion\/([\d.]+)/;
var re_blackberry_4_5 = /\bblackberry\d+\/([\d.]+)/;

function toString(object){
  return Object.prototype.toString.call(object);
}
function isObject(object){
  return toString(object) === "[object Object]";
}
function isFunction(object){
  return toString(object) === "[object Function]";
}
function each(object, factory){
  for(var i = 0, l = object.length; i < l; i++){
    if(factory.call(object, object[i], i) === false){
      break;
    }
  }
}

// 硬件设备信息识别表达式。
// 使用数组可以按优先级排序。
var DEVICES = [
  ["nokia", function(ua){
    // 不能将两个表达式合并，因为可能出现 "nokia; nokia 960"
    // 这种情况下会优先识别出 nokia/-1
    if(ua.indexOf("nokia ") !== -1){
      return /\bnokia ([0-9]+)?/;
    }else{
      return /\bnokia([a-z0-9]+)?/;
    }
  }],
  // 三星有 Android 和 WP 设备。
  ["samsung", function(ua){
    if(ua.indexOf("samsung") !== -1){
      return /\bsamsung(?:[ \-](?:sgh|gt|sm))?-([a-z0-9]+)/;
    }else{
      return /\b(?:sgh|sch|gt|sm)-([a-z0-9]+)/;
    }
  }],
  ["wp", function(ua){
    return ua.indexOf("windows phone ") !== -1 ||
      ua.indexOf("xblwp") !== -1 ||
      ua.indexOf("zunewp") !== -1 ||
      ua.indexOf("windows ce") !== -1;
  }],
  ["pc", "windows"],
  ["ipad", "ipad"],
  // ipod 规则应置于 iphone 之前。
  ["ipod", "ipod"],
  ["iphone", /\biphone\b|\biph(\d)/],
  ["mac", "macintosh"],
  // 小米
  ["mi", /\bmi[ \-]?([a-z0-9 ]+(?= build|\)))/],
  // 红米
  ["hongmi", /\bhm[ \-]?([a-z0-9]+)/],
  ["aliyun", /\baliyunos\b(?:[\-](\d+))?/],
  ["meizu", function(ua) {
    return ua.indexOf("meizu") >= 0 ?
      /\bmeizu[\/ ]([a-z0-9]+)\b/
      :
      /\bm([0-9cx]{1,4})\b/;
  }],
  ["nexus", /\bnexus ([0-9s.]+)/],
  ["huawei", function(ua){
    var re_mediapad = /\bmediapad (.+?)(?= build\/huaweimediapad\b)/;
    if(ua.indexOf("huawei-huawei") !== -1){
      return /\bhuawei\-huawei\-([a-z0-9\-]+)/;
    }else if(re_mediapad.test(ua)){
      return re_mediapad;
    }else{
      return /\bhuawei[ _\-]?([a-z0-9]+)/;
    }
  }],
  ["lenovo", function(ua){
    if(ua.indexOf("lenovo-lenovo") !== -1){
      return /\blenovo\-lenovo[ \-]([a-z0-9]+)/;
    }else{
      return /\blenovo[ \-]?([a-z0-9]+)/;
    }
  }],
  // 中兴
  ["zte", function(ua){
    if(/\bzte\-[tu]/.test(ua)){
      return /\bzte-[tu][ _\-]?([a-su-z0-9\+]+)/;
    }else{
      return /\bzte[ _\-]?([a-su-z0-9\+]+)/;
    }
  }],
  // 步步高
  ["vivo", /\bvivo(?: ([a-z0-9]+))?/],
  ["htc", function(ua){
    if(/\bhtc[a-z0-9 _\-]+(?= build\b)/.test(ua)){
      return /\bhtc[ _\-]?([a-z0-9 ]+(?= build))/;
    }else{
      return /\bhtc[ _\-]?([a-z0-9 ]+)/;
    }
  }],
  ["oppo", /\boppo[_]([a-z0-9]+)/],
  ["konka", /\bkonka[_\-]([a-z0-9]+)/],
  ["sonyericsson", /\bmt([a-z0-9]+)/],
  ["coolpad", /\bcoolpad[_ ]?([a-z0-9]+)/],
  ["lg", /\blg[\-]([a-z0-9]+)/],
  ["android", /\bandroid\b|\badr\b/],
  ["blackberry", function(ua){
    if (ua.indexOf("blackberry") >= 0) {
      return /\bblackberry\s?(\d+)/;
    }
    return "bb10";
  }],
];

// 操作系统信息识别表达式
var OS = [
  ["wp", function(ua){
    if(ua.indexOf("windows phone ") !== -1){
      return /\bwindows phone (?:os )?([0-9.]+)/;
    }else if(ua.indexOf("xblwp") !== -1){
      return /\bxblwp([0-9.]+)/;
    }else if(ua.indexOf("zunewp") !== -1){
      return /\bzunewp([0-9.]+)/;
    }
    return "windows phone";
  }],
  ["windows", /\bwindows nt ([0-9.]+)/],
  ["macosx", /\bmac os x ([0-9._]+)/],
  ["ios", function(ua){
    if(/\bcpu(?: iphone)? os /.test(ua)){
      return /\bcpu(?: iphone)? os ([0-9._]+)/;
    }else if(ua.indexOf("iph os ") !== -1){
      return /\biph os ([0-9_]+)/;
    }else{
      return /\bios\b/;
    }
  }],
  ["yunos", /\baliyunos ([0-9.]+)/],
  ["android", function(ua){
    if(ua.indexOf("android") >= 0){
      return /\bandroid[ \/-]?([0-9.x]+)?/;
    }else if(ua.indexOf("adr") >= 0){
      if(ua.indexOf("mqqbrowser") >= 0){
        return /\badr[ ]\(linux; u; ([0-9.]+)?/;
      }else{
        return /\badr(?:[ ]([0-9.]+))?/;
      }
    }
    return "android";
    //return /\b(?:android|\badr)(?:[\/\- ](?:\(linux; u; )?)?([0-9.x]+)?/;
  }],
  ["chromeos", /\bcros i686 ([0-9.]+)/],
  ["linux", "linux"],
  ["windowsce", /\bwindows ce(?: ([0-9.]+))?/],
  ["symbian", /\bsymbian(?:os)?\/([0-9.]+)/],
  ["blackberry", function(ua){
    var m = ua.match(re_blackberry_10) ||
      ua.match(re_blackberry_6_7) ||
      ua.match(re_blackberry_4_5);
    return m ? {version: m[1]} : "blackberry";
  }],
];

// 解析使用 Trident 内核的浏览器的 `浏览器模式` 和 `文档模式` 信息。
// @param {String} ua, userAgent string.
// @return {Object}
function IEMode(ua){
  if(!re_msie.test(ua)){ return null; }

  var m,
      engineMode, engineVersion,
      browserMode, browserVersion;

  // IE8 及其以上提供有 Trident 信息，
  // 默认的兼容模式，UA 中 Trident 版本不发生变化。
  if(ua.indexOf("trident/") !== -1){
    m = /\btrident\/([0-9.]+)/.exec(ua);
    if (m && m.length >= 2) {
      // 真实引擎版本。
      engineVersion = m[1];
      var v_version = m[1].split(".");
      v_version[0] = parseInt(v_version[0], 10) + 4;
      browserVersion = v_version.join(".");
    }
  }

  m = re_msie.exec(ua);
  browserMode = m[1];
  var v_mode = m[1].split(".");
  if (typeof browserVersion === "undefined") {
    browserVersion = browserMode;
  }
  v_mode[0] = parseInt(v_mode[0], 10) - 4;
  engineMode = v_mode.join(".");
  if (typeof engineVersion === "undefined") {
    engineVersion = engineMode;
  }

  return {
    browserVersion: browserVersion,
    browserMode: browserMode,
    engineVersion: engineVersion,
    engineMode: engineMode,
    compatible: engineVersion !== engineMode,
  };
}

// 针对同源的 TheWorld 和 360 的 external 对象进行检测。
// @param {String} key, 关键字，用于检测浏览器的安装路径中出现的关键字。
// @return {Undefined,Boolean,Object} 返回 undefined 或 false 表示检测未命中。
function checkTW360External(key){
  if(!external){ return; } // return undefined.
  try{
    //        360安装路径：
    //        C:%5CPROGRA~1%5C360%5C360se3%5C360SE.exe
    var runpath = external.twGetRunPath.toLowerCase();
    // 360SE 3.x ~ 5.x support.
    // 暴露的 external.twGetVersion 和 external.twGetSecurityID 均为 undefined。
    // 因此只能用 try/catch 而无法使用特性判断。
    var security = external.twGetSecurityID(win);
    var version = external.twGetVersion(security);

    if (runpath && runpath.indexOf(key) === -1) { return false; }
    if (version){return {version: version}; }
  }catch(ex){ /* */ }
}

var ENGINE = [
  ["edgehtml", /edge\/([0-9.]+)/],
  ["trident", re_msie],
  ["blink", function(){
    return "chrome" in win && "CSS" in win && /\bapplewebkit[\/]?([0-9.+]+)/;
  }],
  ["webkit", /\bapplewebkit[\/]?([0-9.+]+)/],
  ["gecko", function(ua){
    var match;
    if ((match = ua.match(/\brv:([\d\w.]+).*\bgecko\/(\d+)/))) {
      return {
        version: match[1] + "." + match[2],
      };
    }
  }],
  ["presto", /\bpresto\/([0-9.]+)/],
  ["androidwebkit", /\bandroidwebkit\/([0-9.]+)/],
  ["coolpadwebkit", /\bcoolpadwebkit\/([0-9.]+)/],
  ["u2", /\bu2\/([0-9.]+)/],
  ["u3", /\bu3\/([0-9.]+)/],
];
var BROWSER = [
  // Microsoft Edge Browser, Default browser in Windows 10.
  ["edge", /edge\/([0-9.]+)/],
  // Sogou.
  ["sogou", function(ua){
    if (ua.indexOf("sogoumobilebrowser") >= 0) {
      return /sogoumobilebrowser\/([0-9.]+)/;
    } else if (ua.indexOf("sogoumse") >= 0){
      return true;
    }
    return / se ([0-9.x]+)/;
  }],
  // TheWorld (世界之窗)
  // 由于裙带关系，TheWorld API 与 360 高度重合。
  // 只能通过 UA 和程序安装路径中的应用程序名来区分。
  // TheWorld 的 UA 比 360 更靠谱，所有将 TheWorld 的规则放置到 360 之前。
  ["theworld", function(){
    var x = checkTW360External("theworld");
    if(typeof x !== "undefined"){ return x; }
    return "theworld";
  }],
  // 360SE, 360EE.
  ["360", function(ua) {
    var x = checkTW360External("360se");
    if(typeof x !== "undefined"){ return x; }
    if(ua.indexOf("360 aphone browser") !== -1){
      return /\b360 aphone browser \(([^\)]+)\)/;
    }
    return /\b360(?:se|ee|chrome|browser)\b/;
  }],
  // Maxthon
  ["maxthon", function(){
    try{
      if(external && (external.mxVersion || external.max_version)){
        return {
          version: external.mxVersion || external.max_version,
        };
      }
    }catch(ex){ /* */ }
    return /\b(?:maxthon|mxbrowser)(?:[ \/]([0-9.]+))?/;
  }],
  ["micromessenger", /\bmicromessenger\/([\d.]+)/],
  ["qq", /\bm?qqbrowser\/([0-9.]+)/],
  ["green", "greenbrowser"],
  ["tt", /\btencenttraveler ([0-9.]+)/],
  ["liebao", function(ua){
    if (ua.indexOf("liebaofast") >= 0){
      return /\bliebaofast\/([0-9.]+)/;
    }
    if(ua.indexOf("lbbrowser") === -1){ return false; }
    var version;
    try{
      if(external && external.LiebaoGetVersion){
        version = external.LiebaoGetVersion();
      }
    }catch(ex){ /* */ }
    return {
      version: version || NA_VERSION,
    };
  }],
  ["tao", /\btaobrowser\/([0-9.]+)/],
  ["coolnovo", /\bcoolnovo\/([0-9.]+)/],
  ["saayaa", "saayaa"],
  // 有基于 Chromniun 的急速模式和基于 IE 的兼容模式。必须在 IE 的规则之前。
  ["baidu", /\b(?:ba?idubrowser|baiduhd)[ \/]([0-9.x]+)/],
  // 后面会做修复版本号，这里只要能识别是 IE 即可。
  ["ie", re_msie],
  ["mi", /\bmiuibrowser\/([0-9.]+)/],
  // Opera 15 之后开始使用 Chromniun 内核，需要放在 Chrome 的规则之前。
  ["opera", function(ua){
    var re_opera_old = /\bopera.+version\/([0-9.ab]+)/;
    var re_opera_new = /\bopr\/([0-9.]+)/;
    return re_opera_old.test(ua) ? re_opera_old : re_opera_new;
  }],
  ["oupeng", /\boupeng\/([0-9.]+)/],
  ["yandex", /yabrowser\/([0-9.]+)/],
  // 支付宝手机客户端
  ["ali-ap", function(ua){
    if(ua.indexOf("aliapp") > 0){
      return /\baliapp\(ap\/([0-9.]+)\)/;
    }else{
      return /\balipayclient\/([0-9.]+)\b/;
    }
  }],
  // 支付宝平板客户端
  ["ali-ap-pd", /\baliapp\(ap-pd\/([0-9.]+)\)/],
  // 支付宝商户客户端
  ["ali-am", /\baliapp\(am\/([0-9.]+)\)/],
  // 淘宝手机客户端
  ["ali-tb", /\baliapp\(tb\/([0-9.]+)\)/],
  // 淘宝平板客户端
  ["ali-tb-pd", /\baliapp\(tb-pd\/([0-9.]+)\)/],
  // 天猫手机客户端
  ["ali-tm", /\baliapp\(tm\/([0-9.]+)\)/],
  // 天猫平板客户端
  ["ali-tm-pd", /\baliapp\(tm-pd\/([0-9.]+)\)/],
  // UC 浏览器，可能会被识别为 Android 浏览器，规则需要前置。
  // UC 桌面版浏览器携带 Chrome 信息，需要放在 Chrome 之前。
  ["uc", function(ua){
    if(ua.indexOf("ucbrowser/") >= 0){
      return /\bucbrowser\/([0-9.]+)/;
    } else if(ua.indexOf("ubrowser/") >= 0){
      return /\bubrowser\/([0-9.]+)/;
    }else if(/\buc\/[0-9]/.test(ua)){
      return /\buc\/([0-9.]+)/;
    }else if(ua.indexOf("ucweb") >= 0){
      // `ucweb/2.0` is compony info.
      // `UCWEB8.7.2.214/145/800` is browser info.
      return /\bucweb([0-9.]+)?/;
    }else{
      return /\b(?:ucbrowser|uc)\b/;
    }
  }],
  ["chrome", / (?:chrome|crios|crmo)\/([0-9.]+)/],
  // Android 默认浏览器。该规则需要在 safari 之前。
  ["android", function(ua){
    if(ua.indexOf("android") === -1){ return; }
    return /\bversion\/([0-9.]+(?: beta)?)/;
  }],
  ["blackberry", function(ua){
    var m = ua.match(re_blackberry_10) ||
      ua.match(re_blackberry_6_7) ||
      ua.match(re_blackberry_4_5);
    return m ? {version: m[1]} : "blackberry";
  }],
  ["safari", /\bversion\/([0-9.]+(?: beta)?)(?: mobile(?:\/[a-z0-9]+)?)? safari\//],
  // 如果不能被识别为 Safari，则猜测是 WebView。
  ["webview", /\bcpu(?: iphone)? os (?:[0-9._]+).+\bapplewebkit\b/],
  ["firefox", /\bfirefox\/([0-9.ab]+)/],
  ["nokia", /\bnokiabrowser\/([0-9.]+)/],
];

// UserAgent Detector.
// @param {String} ua, userAgent.
// @param {Object} expression
// @return {Object}
//    返回 null 表示当前表达式未匹配成功。
function detect(name, expression, ua){
  var expr = isFunction(expression) ? expression.call(null, ua) : expression;
  if(!expr){ return null; }
  var info = {
    name: name,
    version: NA_VERSION,
    codename: "",
  };
  var t = toString(expr);
  if(expr === true){
    return info;
  }else if(t === "[object String]"){
    if(ua.indexOf(expr) !== -1){
      return info;
    }
  }else if(isObject(expr)){ // Object
    if(expr.hasOwnProperty("version")){
      info.version = expr.version;
    }
    return info;
  }else if(expr.exec){ // RegExp
    var m = expr.exec(ua);
    if(m){
      if(m.length >= 2 && m[1]){
        info.version = m[1].replace(/_/g, ".");
      }else{
        info.version = NA_VERSION;
      }
      return info;
    }
  }
}

var na = {name:"na", version:NA_VERSION};
// 初始化识别。
function init(ua, patterns, factory, detector){
  var detected = na;
  each(patterns, function(pattern){
    var d = detect(pattern[0], pattern[1], ua);
    if(d){
      detected = d;
      return false;
    }
  });
  factory.call(detector, detected.name, detected.version);
}

// 解析 UserAgent 字符串
// @param {String} ua, userAgent string.
// @return {Object}
var parse = function(ua){
  ua = (ua || "").toLowerCase();
  var d = {};

  init(ua, DEVICES, function(name, version){
    var v = parseFloat(version);
    d.device = {
      name: name,
      version: v,
      fullVersion: version,
    };
    d.device[name] = v;
  }, d);

  init(ua, OS, function(name, version){
    var v = parseFloat(version);
    d.os = {
      name: name,
      version: v,
      fullVersion: version,
    };
    d.os[name] = v;
  }, d);

  var ieCore = IEMode(ua);

  init(ua, ENGINE, function(name, version){
    var mode = version;
    // IE 内核的浏览器，修复版本号及兼容模式。
    if(ieCore){
      version = ieCore.engineVersion || ieCore.engineMode;
      mode = ieCore.engineMode;
    }
    var v = parseFloat(version);
    d.engine = {
      name: name,
      version: v,
      fullVersion: version,
      mode: parseFloat(mode),
      fullMode: mode,
      compatible: ieCore ? ieCore.compatible : false,
    };
    d.engine[name] = v;
  }, d);

  init(ua, BROWSER, function(name, version){
    var mode = version;
    // IE 内核的浏览器，修复浏览器版本及兼容模式。
    if(ieCore){
      // 仅修改 IE 浏览器的版本，其他 IE 内核的版本不修改。
      if(name === "ie"){
        version = ieCore.browserVersion;
      }
      mode = ieCore.browserMode;
    }
    var v = parseFloat(version);
    d.browser = {
      name: name,
      version: v,
      fullVersion: version,
      mode: parseFloat(mode),
      fullMode: mode,
      compatible: ieCore ? ieCore.compatible : false,
    };
    d.browser[name] = v;
  }, d);
  return d;
};


// NodeJS.
if(typeof process === "object" && process.toString() === "[object process]"){

  // 加载更多的规则。
  var morerule = module["require"]("./morerule");
  [].unshift.apply(DEVICES, morerule.DEVICES || []);
  [].unshift.apply(OS, morerule.OS || []);
  [].unshift.apply(BROWSER, morerule.BROWSER || []);
  [].unshift.apply(ENGINE, morerule.ENGINE || []);

}else{

  var userAgent = navigator.userAgent || "";
  //var platform = navigator.platform || "";
  var appVersion = navigator.appVersion || "";
  var vendor = navigator.vendor || "";
  external = win.external;

  detector = parse(userAgent + " " + appVersion + " " + vendor);

}

// exports `parse()` API anyway.
detector.parse = parse;

module.exports = detector;

}).call(this,require('_process'))
},{"_process":5}],5:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[1]);
