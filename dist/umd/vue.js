(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function isObject(data) {
    return _typeof(data) === 'object' && data !== null;
  }
  function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[source][key];
      },
      set: function set(val) {
        vm[source][key] = val;
      }
    });
  }
  var API_HOOkS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated'];
  var starts = {};

  starts.components = function (parent, child) {
    var res = Object.create(parent); //res.__proto__ = Object.create(parent)

    for (var key in child) {
      res[key] = child[key];
    }

    return res;
  }; // starts.data = function(parent,child){
  //     return child
  // }


  API_HOOkS.forEach(function (hook) {
    starts[hook] = mergeHook;
  });

  function mergeHook(parent, child) {
    if (child) {
      if (parent) {
        return parent.concat(child);
      } else {
        return [child];
      }
    } else {
      return parent;
    }
  }

  function mergeOptions(parent, child) {
    var options = {};

    for (var key in parent) {
      mergefile(key);
    }

    for (var _key in child) {
      if (!parent.hasOwnProperty(_key)) {
        mergefile(_key);
      }
    }

    function mergefile(key) {
      if (starts[key]) {
        options[key] = starts[key](parent[key], child[key]);
        return options[key];
      }

      if (_typeof(parent[key]) == 'object' && _typeof(child[key]) === 'object') {
        options[key] = _objectSpread2(_objectSpread2({}, parent[key]), child[key]); //如果是引用类型，则合并
      } else if (!child[key]) {
        //如果子类型没有则用父类型
        options[key] = parent[key];
      } else {
        options[key] = child[key];
      }
    }

    return options;
  }
  var isReservedTag = makeMap('a,div,ul,li,span,p');

  function makeMap(str) {
    var mapping = {};
    var list = str.split(',');
    list.forEach(function (item) {
      mapping[item] = true;
    });
    return function (tag) {
      return mapping[tag];
    };
  }

  var oldArrayMethods = Array.prototype;
  var arrayMethods = Object.create(oldArrayMethods); //列举出会使数据变化的方法

  var methods = ['push', 'pop', 'shift', 'unshift', 'splice', 'reverce', 'sort'];
  methods.forEach(function (name) {
    arrayMethods[name] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = oldArrayMethods[name].apply(this, args);
      var inserted,
          ob = this.__ob__;

      switch (name) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          inserted = args.slice(2);
      }

      console.log('push', this);
      ob.dep.notify(); //数组push的时候不会触发get那里的notify

      ob.observeArray(inserted);
      return result;
    };
  });

  var id = 0;

  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.id = id++;
      this.subs = [];
    }

    _createClass(Dep, [{
      key: "addSub",
      value: function addSub(watcher) {
        // 因为在addDep是去重了，所以这里不会重复添加watcher ，有几个需要观测的就有几个watcher
        this.subs.push(watcher);
      }
    }, {
      key: "depend",
      value: function depend() {
        // 让watcher记住当前的dep
        // this.subs.push(Dep.target)
        // 保存在watcher实例上一个dep
        Dep.target.addDep(this);
      }
    }, {
      key: "notify",
      value: function notify() {
        // 阶段一：只是有数据的更改，没有computed等，此时每个sub中只有一个watcher
        this.subs.forEach(function (watcher) {
          watcher.update(); //修改完数据，触发updated

          if (watcher.isWatcher) {
            watcher.cb(); //触发updated 生命周期
          }
        });
      }
    }]);

    return Dep;
  }();

  var stack = []; // 在初始化时 new Watcher的时候调用，然后执行getters函数，触发get函数

  function pushTarget(watcher) {
    Dep.target = watcher;
    stack.push(watcher);
  }
  function popTarget() {
    stack.pop();
    Dep.target = stack[stack.length - 1];
  }

  var Observe = /*#__PURE__*/function () {
    function Observe(data) {
      _classCallCheck(this, Observe);

      this.dep = new Dep();
      console.log(data);
      Object.defineProperty(data, '__ob__', {
        enumerable: false,
        configurable: false,
        value: this
      });

      if (Array.isArray(data)) {
        data.__proto__ = arrayMethods;
        this.observeArray(data);
      } else {
        this.walk(data); //监听对象
      }
    }

    _createClass(Observe, [{
      key: "walk",
      value: function walk(data) {
        var keys = Object.keys(data);

        for (var i = 0, len = keys.length; i < len; i++) {
          var key = keys[i];
          var value = data[key];
          console.log(data, key, value);
          defineReactive(data, key, value);
        }
      }
    }, {
      key: "observeArray",
      value: function observeArray(data) {
        for (var i = 0, len = data.length; i < len; i++) {
          observe(data[i]);
        }
      }
    }]);

    return Observe;
  }(); //defineReactive只监听对象


  function defineReactive(data, key, value) {
    var dep = new Dep(); //[1,2,3] [1,2,3] [1,2,3]

    var childOb = observe(value);
    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: true,
      get: function get() {
        if (Dep.target) {
          //已经触发 pushTarget 并且Dep.target = Watcher的实例
          dep.depend(); //存watcher  如果是对象或者是数组会depend两次，  childOb.dep.depend()   dep.depend()

          if (childOb) {
            //数组的依赖收集  这样this中就会得到收集watcher的notify
            childOb.dep.depend(); // 如果数组中还有数组 

            if (Array.isArray(value)) {
              dependArray(value);
            }
          }
        }

        return value;
      },
      set: function set(newValue) {
        if (newValue === value) return;
        observe(newValue); //用户设置的值可能是一个对象

        value = newValue;
        dep.notify(); //更新watcher 如果是数组push等不会触发set方法  notify只是为了更新dom
      }
    });
  } // 数组中的数组的依赖收集


  function dependArray(val) {
    for (var i = 0; i < val.length; i++) {
      var current = val[i];
      current.__ob__ && current.__ob__.dep.depend();

      if (Array.isArray(current)) {
        dependArray(current);
      }
    }
  }

  function observe(data) {
    if (!isObject(data)) return;
    return new Observe(data);
  }

  var callbacks = [];
  var waiting = false;

  function flushCallback() {
    while (callbacks.length) {
      var cb = callbacks.pop();
      cb();
    }

    waiting = false;
  }

  var timerFunc;

  if (Promise) {
    timerFunc = function timerFunc() {
      Promise.resolve().then(flushCallback);
    };
  } else if (MutationObserver) {
    // 监听dom变化 ，如果dom变化执行flushCallback
    var observe$1 = new MutationObserver(flushCallback);
    var textNode = document.createTextNode(1);
    observe$1.observe(textNode, {
      characterData: true
    });

    timerFunc = function timerFunc() {
      textNode.textContent = 2;
    };
  } else if (setImmediate) {
    timerFunc = function timerFunc() {
      setImmediate(flushCallback);
    };
  } else {
    setTimeout(flushCallback);
  }

  function nextTick(cb) {
    // 只要没有添加完就继续添加
    callbacks.push(cb);

    if (!waiting) {
      waiting = true; // 已经放到宏任务中了，等到callbacks  push完毕后才会执行cb
      // setTimeout会最后执行 这样最后只有一个setTimeout 

      timerFunc();
    }
  }

  //调度的功能
  var queue = [];
  var has = {};

  function flushSchedularQueue() {
    queue.forEach(function (watcher) {
      return watcher.run();
    });
    queue = [];
    has = {};
  }
  /**
   * 假设存在属性name，如果多次给name赋值，就会多次触发set，就会多次触发notify 就会触发watcher的update 就会触发geteers
   * 就会渲染dom，也就是说修改了相同的属性，但是还是多次触发没有意义
   */


  function queueWatcher(watcher) {
    var id = watcher.id; //现在只new 了一个watcher 所以id都是0

    if (has[id] == null) {
      has[id] = true;
      queue.push(watcher); // vue.nextTick = promise / mutationObserver / setImmediate / setTimeout  优雅降级
      // 将更新dom放到宏任务中，同步代码执行完毕，再执行宏任务

      nextTick(flushSchedularQueue);
    }
  }

  var id$1 = 0;

  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, exportFn, cb) {
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

      _classCallCheck(this, Watcher);

      this.vm = vm;
      this.cb = cb;
      this.options = options;
      this.isWatcher = _typeof(options) === 'object' ? false : options; //是渲染watcher

      this.id = id$1++;
      this.lazy = options.lazy;
      this.dirty = options.lazy;
      this.user = options.user; //用户 watch

      this.depsid = new Set();
      this.deps = [];

      if (typeof exportFn == 'function') {
        this.getter = exportFn;
      } else {
        // getter 返回当前值
        this.getter = function () {
          var val = exportFn.split('.');
          return val.reduce(function (p, c) {
            return p[c];
          }, vm);
        };
      } // 默认先调用一次get  取值将结果保留下来


      if (!this.lazy) {
        this.value = this.get();
      }
    }

    _createClass(Watcher, [{
      key: "addDep",
      value: function addDep(dep) {
        // watcher里不能放重复的dep dep中不能放重复的watcher
        // 进行去重操作，可能重复触发get 
        var id = dep.id;

        if (!this.depsid.has(id)) {
          this.depsid.add(id);
          this.deps.push(dep);
          dep.addSub(this);
        }
      }
    }, {
      key: "get",
      value: function get() {
        pushTarget(this); //添加watcher

        var redult = this.getter.call(this.vm); //渲染watcher执行,调用render

        popTarget();
        return redult;
      }
    }, {
      key: "update",
      value: function update() {
        if (this.lazy) {
          this.dirty = true;
        } else {
          // 每次get都会调用watcher中的get
          // this.get()
          queueWatcher(this);
        }
      }
    }, {
      key: "run",
      value: function run() {
        this.newValue = this.get();
        this.oldValue = this.value;

        if (this.user) {
          this.cb.call(this.vm, this.newValue, this.oldValue);
        }
      }
    }, {
      key: "evaluate",
      value: function evaluate() {
        this.value = this.get();
        this.dirty = false;
      }
    }, {
      key: "depend",
      value: function depend() {
        var i = this.deps.length;

        while (i--) {
          this.deps[i].depend(); //继续收集watcher 
        }
      }
    }]);

    return Watcher;
  }();

  function initState(vm) {
    var opts = vm.$options;

    if (opts.props) ;

    if (opts.data) {
      initData(vm);
    }

    if (opts.computed) {
      // 原理也是get ，会缓存，内部有变量 dirty
      // 也是一个watcher
      initComputed(vm);
    }

    if (opts.methods) {
      initMethods(vm);
    }

    if (opts.watch) {
      initWatch(vm);
    }
  }

  function initData(vm) {
    var data = vm.$options.data;
    data = vm._data = typeof data === 'function' ? data.call(vm) : data;

    for (var key in data) {
      proxy(vm, '_data', key);
    }

    observe(data);
  }

  function initComputed(vm) {
    var computed = vm.$options.computed;
    var watchers = vm._computedWatchers = {}; // 1. 需要有watcher
    // 2. 需要通过defineProperty
    // 3. 需要一个变量

    for (var key in computed) {
      var userDep = computed[key];
      var getter = typeof userDep === 'function' ? userDep : userDep.get;
      watchers[key] = new Watcher(vm, getter, function () {}, {
        lazy: true
      });
      defineCpmputed(vm, key, userDep);
    }
  }

  var sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: function get() {},
    set: function set() {}
  };

  function defineCpmputed(target, key, userDep) {
    if (typeof userDep === 'function') {
      // 需要重写get ， 进行缓存
      sharedPropertyDefinition.get = createComputedGetter(key);
    } else {
      sharedPropertyDefinition.get = createComputedGetter(key);
      sharedPropertyDefinition.set = userDep.set;
    }

    Object.defineProperty(target, key, sharedPropertyDefinition);
  }

  function createComputedGetter(key) {
    return function () {
      //如果是脏的就执行
      var watcher = this._computedWatchers[key];

      if (watcher) {
        if (watcher.dirty) {
          //如果是脏的就求值
          watcher.evaluate();
        }

        if (Dep.target) {
          /**
           * watcher则个watcher是计算属性的watcher ，如果存在其他watcher那么久收集起来
           */
          watcher.depend();
        }

        return watcher.value;
      }
    };
  }

  function initMethods(vm) {
    var methods = vm.$options.methods;
    Object.keys(methods).forEach(function (method) {
      return method.bind(vm);
    });
  }

  function initWatch(vm) {
    var watch = vm.$options.watch;

    var _loop = function _loop(key) {
      var handlers = watch[key];

      if (Array.isArray(handlers)) {
        handlers.forEach(function (handler) {
          ///watch 的值是数组
          createWatcher(vm, key, handler);
        });
      } else {
        createWatcher(vm, key, handlers); //watch 的值是函数，字符串，对象
      }
    };

    for (var key in watch) {
      _loop(key);
    }
  }

  function createWatcher(vm, exprOrFn, handler, options) {
    if (_typeof(handler) == 'object') {
      options = handler;
      handler = handler.handler;
    }

    if (typeof handler == 'string') {
      //使用的是methods上的方法
      handler = vm[handler];
    }
    /**
     * exprOrFn 监听的属性
     * handler 监听的方法
     * options 监听的配置
     * 
     */


    return vm.$watch(exprOrFn, handler, options);
  }

  function stateMixin(Vue) {
    Vue.prototype.$watch = function (exprOrFn, cb) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      new Watcher(this, exprOrFn, cb, _objectSpread2(_objectSpread2({}, options), {}, {
        user: true
      }));

      if (options.immediate) {
        cb();
      }
    };
  }

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*";
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")");
  var startTagOpen = new RegExp("^<".concat(qnameCapture));
  var startTagClose = /^\s*(\/?)>/;
  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>"));
  var currentParen;
  var root;
  var stack$1 = [];
  var ELEMENT_TYPE = 1;
  var TEXT_TYPE = 3;

  function createAstElement(tagName, attrs) {
    return {
      tag: tagName,
      type: ELEMENT_TYPE,
      parent: null,
      children: [],
      attrs: attrs
    };
  }

  function start(tagName, attrs) {
    var ele = createAstElement(tagName, attrs);

    if (!root) {
      root = ele;
    }

    currentParen = ele;
    stack$1.push(ele);
  }

  function chars(text) {
    text = text.replace(/\s/g, '');

    if (text) {
      currentParen.children.push({
        text: text,
        type: TEXT_TYPE
      });
    }
  }

  function end(tagName) {
    var ele = stack$1.pop();
    currentParen = stack$1[stack$1.length - 1];

    if (currentParen) {
      ele.parent = currentParen;
      currentParen.children.push(ele);
    }
  }

  function paeseHTML(html) {
    root = null;

    while (html) {
      var textEnd = html.indexOf('<');

      if (textEnd === 0) {
        //如果等于0那么是开始标签
        var startTagMatch = parseStartTag();

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }

        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
          continue;
        }
      }

      var text = void 0;

      if (textEnd >= 0) {
        text = html.substring(0, textEnd);
      }

      if (text) {
        chars(text);
        advance(text.length);
      }
    }

    return root;

    function advance(n) {
      html = html.substring(n);
    }

    function parseStartTag() {
      var start = html.match(startTagOpen);
      var parse = {
        tagName: start && start[1],
        attrs: []
      };
      advance(start && start[0].length); //删除已经放到parse中的字符串

      var attrs, end;

      while ((attrs = html.match(attribute)) && !(end = html.match(startTagClose))) {
        //如果有属性，并且不是结束标签
        var obj = {
          name: attrs[1],
          value: attrs[3]
        };
        parse.attrs.push(obj);
        advance(attrs[0].length);
      }

      if (end = html.match(startTagClose)) {
        advance(end[0].length);
        return parse;
      }

      return null;
    }
  }

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
  function compileToFunctoin(template) {
    var root = paeseHTML(template); //将AST语法树生成render函数
    // <div id='app'><p>hello {{name}}</p>hello</div>
    //_c('div',{id:"app"},_c('p',undefined,_v("hello" + _s(name)),_v('hello')))

    return function render() {
      var code = generate(root);
      var renderFn = new Function("with(this){ return ".concat(code, "}"));
      return renderFn;
    };
  }

  function generate(el) {
    var code = "_c('".concat(el.tag, "',\n     ").concat(el.attrs.length ? geneProps(el.attrs) : 'undefined', ",\n     ").concat(genChildren(el) ? genChildren(el) : '', ")\n     ");
    return code;
  }

  function genChildren(el) {
    var children = el.children;

    if (children && children.length) {
      return children.map(function (c) {
        return gen(c);
      }).join(','); // for(let i = 0 ; i < children.length;i++){
      //     children[i].type == 1 ? text += generate(children[i])+',' : text += `_v(${children[i].text})`+ ','
      // }
    } else {
      return false;
    }
  }

  function gen(node) {
    if (node.type == 1) {
      return generate(node);
    } else {
      var text = node.text;
      var tokens = [];
      var match, index;
      var lastIndex = defaultTagRE.lastIndex = 0;

      while (match = defaultTagRE.exec(text)) {
        index = match.index;

        if (lastIndex < index) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        } // asas{{as}}asas{{as}}


        tokens.push("_s(".concat(match[1], ")"));
        lastIndex = index + match[0].length;
      }

      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }

      return "_v(".concat(tokens.join('+'), ")");
    }
  }

  function geneProps(attrs) {
    var str = '';
    attrs.forEach(function (item) {
      if (item.name === 'style') {
        var obj = {};

        var _item$value$split = item.value.split(':'),
            _item$value$split2 = _slicedToArray(_item$value$split, 2),
            key = _item$value$split2[0],
            value = _item$value$split2[1];

        obj[key] = value;
        item.value = obj;
      }

      str += "".concat(item.name, ":").concat(JSON.stringify(item.value), ",");
    });
    return "{".concat(str.slice(0, -1), "}");
  }

  function patch(oldVnode, vnode) {
    if (!oldVnode) {
      return createElm(vnode);
    } // 第一次不进行对比，初始化的时候将真实dom渲染成虚拟dom


    var isRealElement = oldVnode.nodeType;

    if (isRealElement === 1) {
      var oldElm = oldVnode;
      var parentElm = oldElm.parentNode; //body

      var el = createElm(vnode);
      parentElm.insertBefore(el, oldVnode.nextSibling); //把新的节点放到原来节点的后面

      oldElm.remove();
      return el;
    } else {
      // 更新时 用老的虚拟节点与新的进行对比，将不同的地方更新真实的dom
      // 如果tag不同，那么直接替换
      if (oldVnode.tag !== vnode.tag) {
        return oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el);
      } // 如果标签一样 tag都是undefined


      if (!oldVnode.tag) {
        if (oldVnode.text !== vnode.text) {
          return oldVnode.el.textContent = vnode.text;
        }
      } // 标签一样 比对属性 和 儿子  标签一样直接复用


      var _el = vnode.el = oldVnode.el;

      updateProperties(vnode, oldVnode.data);
      var oldChildren = oldVnode.children || [];
      var newChildren = vnode.children || []; // 儿子的比较

      if (oldChildren.length && newChildren.length) {
        // 3、 老的有儿子，新的也有儿子s
        updateChildren(oldChildren, newChildren, _el);
      } else if (oldChildren.length) {
        // 1、 老的有儿子，新的没有儿子
        _el.innerHTML = '';
      } else {
        // 2、 老的没儿子，新的有儿子
        for (var i = 0; i < newChildren.length; i++) {
          var child = newChildren[i];

          _el.appendChild(createElm(child));
        }
      }
    }
  }

  function isSameVnode(oldVnode, newVnode) {
    return oldVnode.tag == newVnode.tag && oldVnode.key == newVnode.key;
  }

  function makeIndexByKey(children) {
    var map = {};
    children.forEach(function (item, index) {
      if (item.key) {
        map[item.key] = index;
      }
    });
    return map;
  }

  function updateChildren(oldChildren, newChildren, parent) {
    var oldStartIndex = 0;
    var oldStartVnode = oldChildren[0];
    var oldEndIndex = oldChildren.length - 1;
    var oldEndVnode = oldChildren[oldChildren.length - 1];
    var newStartIndex = 0;
    var newStartVnode = newChildren[0];
    var newEndIndex = newChildren.length - 1;
    var newEndVnode = newChildren[newChildren.length - 1];
    var map = makeIndexByKey(oldChildren); //把旧的key记录下来

    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
      if (!oldStartVnode) {
        oldStartVnode = oldChildren[++oldStartIndex];
      } else if (!oldEndVnode) {
        oldStartVnode = oldChildren[--oldEndIndex];
      } else if (isSameVnode(oldStartVnode, newStartVnode)) {
        // 如果前面的节点没有改变
        patch(oldStartVnode, newStartVnode); //更新属性

        oldStartVnode = oldChildren[++oldStartIndex];
        newStartVnode = newChildren[++newStartIndex];
      } else if (isSameVnode(oldEndVnode, newEndVnode)) {
        //如果后面的节点没有改变
        patch(oldEndVnode, newEndVnode);
        oldEndVnode = oldChildren[--oldEndIndex];
        newEndVnode = newChildren[--newEndIndex];
      } else if (isSameVnode(oldStartVnode, newEndVnode)) {
        //老的头和新的尾比较
        patch(oldStartVnode, newEndVnode); // 当前元素插到当前元素下一个的前面

        parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling);
        oldStartVnode = oldChildren[++oldStartIndex];
        newEndVnode = newChildren[--newEndIndex];
      } else if (isSameVnode(oldEndVnode, newStartVnode)) {
        //老的尾和新的头比较
        patch(oldEndVnode, newStartVnode);
        parent.insertBefore(oldEndVnode.el, oldStartVnode.el);
        oldEndVnode = oldChildren[--oldEndIndex];
        newStartVnode = newChildren[++newStartIndex];
      } else {
        //都不相等需要暴力比对
        // 如果这个新节点在老节点中没有 那就直接插入
        var moveIndex = map[newStartVnode.key];

        if (moveIndex == undefined) {
          parent.insertBefore(createElm(newStartVnode), oldStartVnode.el);
        } else {
          var moveVnode = oldChildren[moveIndex];
          oldChildren[moveIndex] = null;
          parent.insertBefore(createElm(moveVnode), oldStartVnode.el); //insertBefore会将元素直接移动走，所以先将这个moveIndex的老元素中设置为null

          patch(moveVnode, newStartVnode);
        }

        newStartVnode = newChildren[++newStartIndex];
      }
    }

    if (oldStartIndex <= oldEndIndex) {
      //将剩余的老的节点删除
      for (var i = oldStartIndex; i <= oldEndIndex; i++) {
        if (oldChildren[i]) {
          parent.removeChild(oldChildren[i].el);
        }
      }
    }

    if (newStartIndex <= newEndIndex) {
      for (var _i = newStartIndex; _i <= newEndIndex; _i++) {
        parent.appendChild(createElm(newChildren[_i])); //新元素前面元素与旧元素不一致，那么newChildren 中存在newEndIndex+1，因为是从后往前比对的，
        // 如果newChildren[newEndIndex + 1] == null 说明是从前往后比对的

        var ele = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1];
        parent.insertBefore(createElm(newChildren[_i]), ele); //insertBefore 当第二个值有的时候会把心的值当道第二个值得前面，如果第二个值是null  insertBefore 相当于appendChild
      }
    }
  }

  function createComponent(vnode) {
    var i = vnode.data; //提取vnode中的data

    if ((i = i.hook) && (i = i.init)) {
      i(vnode);
    }

    if (vnode.componentInstantce) {
      return true;
    }
  }
  /**
   * 创建真实节点
   * @param {*} vnode 虚拟节点
   */


  function createElm(vnode) {
    var tag = vnode.tag,
        children = vnode.children,
        key = vnode.key,
        data = vnode.data,
        text = vnode.text;

    if (typeof tag === 'string') {
      if (createComponent(vnode)) {
        /**
         * 1. 调用mountComponent
         * 2. 创建watcher
         * 3.  vm._update(vm._render())
         * 4. 创建真实节点挂载到vm.$el上
         */
        return vnode.componentInstantce.$el;
      }

      vnode.el = document.createElement(vnode.tag);
      updateProperties(vnode);
      children === null || children === void 0 ? void 0 : children.forEach(function (child) {
        //递归创建儿子节0点，将儿子节点当道父节点
        return vnode.el.appendChild(createElm(child));
      });
    } else {
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  }

  function updateProperties(vnode) {
    var oldProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var newProps = vnode.data || {},
        el = vnode.el; // 如果新节点上没有 老节点有 移除老节点上的属性

    for (var key in oldProps) {
      if (!newProps[key]) {
        el.removeAttribute(key); //移除老节点属性
      }
    }

    var newStyle = newProps.style;
    var oldStyle = oldProps.style; // 新的中没有 老的中有 则删除老的

    for (var _key in oldStyle) {
      if (!newStyle[_key]) {
        el.style[_key] = '';
      }
    } // 新的有 那就正常加载老的上就行


    for (var _key2 in newProps) {
      if (_key2 === 'style') {
        for (var stylekey in newProps.style) {
          el.style[stylekey] = newProps.style[stylekey];
        }
      } else if (_key2 === 'class') {
        el.className = newProps[_key2];
      } else {
        el.setAttribute(_key2, newProps[_key2]);
      }
    }
  }

  function lifecycleMixin(Vue) {
    // 通过虚拟DOM创建真实的DOm
    Vue.prototype._update = function (vnode) {
      var vm = this;
      var prevVnode = vm._vnode;

      if (!prevVnode) {
        // 需要用虚拟节点创建真实节点，替换原有的$el
        vm.$el = patch(vm.$el, vnode);
      } else {
        vm.$el = patch(prevVnode, vnode);
      }

      vm._vnode = vnode;
    };
  } //初始化组件

  function mountComponent(vm, el) {
    var options = vm.$options; //render

    vm.$el = el; //真实的dom

    callHook(vm, 'beforeMount'); //_render 通过render方法，渲染出虚拟DOM
    //无论渲染还是更新都会调用此方法

    var updateComponent = function updateComponent() {
      //返回虚拟dom
      vm._update(vm._render());
    }; //渲染watcher


    new Watcher(vm, updateComponent, function () {
      callHook(vm, 'updated');
    }, true);
    callHook(vm, 'mounted');
  }
  function callHook(vm, hook) {
    var handlers = vm.$options[hook];

    if (handlers) {
      handlers.forEach(function (hook) {
        hook.call(vm);
      });
    }
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = mergeOptions(vm.constructor.options, options);
      callHook(vm, 'beforeCreate');
      initState(vm);
      callHook(vm, 'created');
      var el = vm.$options.el;

      if (el) {
        vm.$mount(el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      el = document.querySelector(el);
      var template = vm.$options.template; //如果el存在并且不存在template

      if (!template && el) {
        template = el.outerHTML;
      }

      var render = compileToFunctoin(template)();
      vm.$options.render = render;
      mountComponent(vm, el);
    };

    Vue.prototype.$nextTick = nextTick;
  }

  /**
   * 
   * @param {*} tag 标签
   * @param {*} data 属性
   * @param  {...any} children 
   */

  function createElement(vm, tag) {
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var key = data.key;
    key ? delete data.key : '';

    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }

    if (isReservedTag(tag)) {
      return vnode(tag, data, key, children, undefined);
    } else {
      var Cons = vm.$options.components[tag]; //全局以及局部的components都在这里，全局的是构造函数，局部的是对象

      if (_typeof(Cons) === 'object') {
        Cons = vm.options._base.extent(Cons);
      }

      data.hook = {
        init: function init(vnode) {
          var child = vnode.componentInstantce = new Cons({});
          child.$mount();
          /**
           *  new Cons({})
           * 1. 执行init
           * 2. 调用callhock
           * 3. 初始化state
           * 4. Cons是Sub的实例，继承Vue
           */
        }
      };
      return vnode("vue-compoment-".concat(Cons.cid, "-").concat(tag), data, key, undefined, undefined, {
        Cons: Cons,
        children: children //插槽

      });
    }
  }
  function createTextNode(text) {
    return vnode(undefined, undefined, undefined, undefined, text);
  }

  function vnode(tag, data, key, children, text, componentOptions) {
    return {
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text,
      componentOptions: componentOptions
    };
  }

  function renderMixin(Vue) {
    // _c 创建元素的虚拟节点
    // _v 创建文本的虚拟节点
    // _s JSON.stringify
    Vue.prototype._c = function () {
      return createElement.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    };

    Vue.prototype._v = function (text) {
      return createTextNode(text);
    };

    Vue.prototype._s = function (val) {
      return val == null ? '' : _typeof(val) === 'object' ? JSON.stringify(val) : val;
    };

    Vue.prototype._render = function () {
      var vm = this;
      var render = vm.$options.render;
      return render.call(vm);
    };
  }

  function initExtent(Vue) {
    var cid = 0;
    var cidarr = [];

    Vue.extent = function (extentOptions) {
      var Sub;
      if (cidarr.includes(cid)) return Sub;
      var Super = this;

      Sub = function VueCompoment(options) {
        this._init(options);
      };

      Sub.cid = cid++;
      cidarr.push(Sub.cid);
      Sub.prototype = Object.create(Super.prototype);
      Sub.prototype.constructor = Sub; // vm.$options = mergeOptions(vm.constructor.options, options) 

      /** 
       * init中的
       * vm是当前sub的实例
       * vm.constructor.options 是Sub.options Sub.options 是Vue.options 和 extent传进来的
       * 相当于将全局的options 与实例的options储存在一起
       */

      Sub.options = mergeOptions(Super.options, extentOptions);
      return Sub;
    };
  }

  function initGlobalAPI(Vue) {
    // 整合了所有的全局api  
    Vue.options = {};

    Vue.mixin = function (mixin) {
      this.options = mergeOptions(this.options, mixin);
    };

    initExtent(Vue);
    Vue.options._base = Vue;
    Vue.options.components = {};

    Vue.component = function (id, definition) {
      definition.name = definition.name || id; // new definition().$mount()

      definition = this.options._base.extent(definition); // 将全局的components挂载到Vue的options上 ，现在全局的components是一个构造函数

      Vue.options.components[id] = definition;
    };
  }

  function Vue(options) {
    this._init(options);
  }

  stateMixin(Vue);
  initMixin(Vue);
  renderMixin(Vue);
  lifecycleMixin(Vue);
  initGlobalAPI(Vue); //合并api

  return Vue;

})));
//# sourceMappingURL=vue.js.map
