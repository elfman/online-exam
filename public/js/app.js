/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(8)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction) {
  isProduction = _isProduction

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[data-vue-ssr-id~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file.
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate

    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(4);
module.exports = __webpack_require__(21);


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

Vue.component('paper-component', __webpack_require__(5));
Vue.component('paper-editor', __webpack_require__(11));
Vue.component('question', __webpack_require__(16));

// $.ajaxSetup({
//     headers: {
//         'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
//     }
// });

// const app = new Vue({
//     el: '#app'
// });

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(6)
}
var normalizeComponent = __webpack_require__(2)
/* script */
var __vue_script__ = __webpack_require__(9)
/* template */
var __vue_template__ = __webpack_require__(10)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-70421e48"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/PaperComponent.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-70421e48", Component.options)
  } else {
    hotAPI.reload("data-v-70421e48", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(7);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("6b36edec", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-70421e48\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./PaperComponent.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-70421e48\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./PaperComponent.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "\n.wrapper[data-v-70421e48] {\n  max-width: 700px;\n  margin: 0 auto;\n}\n.number-box[data-v-70421e48] {\n  position: fixed;\n  right: 40px;\n  top: 150px;\n  width: 250px;\n}\n.number-box .numbers[data-v-70421e48] {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -ms-flex-wrap: wrap;\n        flex-wrap: wrap;\n    margin-left: -6px;\n    margin-right: -6px;\n}\n.number-box span[data-v-70421e48] {\n    display: inline-block;\n    width: 32px;\n    height: 32px;\n    line-height: 32px;\n    border: 1px solid #979797;\n    border-radius: 50%;\n    text-align: center;\n    margin: 6px;\n}\n.number-box span.done[data-v-70421e48] {\n      background-color: #1cc091;\n}\n", ""]);

// exports


/***/ }),
/* 8 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    props: {
        paperId: Number,
        startUrl: String,
        submitUrl: String
    },
    data: function data() {
        return {
            paper: null,
            answers: null,
            boxStatus: null,
            sheetId: null,
            loadingPaper: false,
            modalTitle: null,
            modalContent: null,
            onModalConfirm: this.dismissModal
        };
    },

    methods: {
        startTest: function startTest() {
            var _this = this;

            if (this.loadingPaper) {
                return;
            }
            this.loadingPaper = true;
            $.get(this.startUrl, { force: true }, function (data) {
                console.log(data);
                _this.loadingPaper = false;
                if (!data.error) {
                    _this.sheetId = data.sheet_id, _this.paper = _this.parsePaper(data.paper);
                    _this.answers = _this.initAnswers(_this.paper.content);
                    _this.boxStatus = new Array(_this.answers.length);
                }
            });
        },
        parsePaper: function parsePaper(json) {
            var paper = JSON.parse(json);
            paper.content = JSON.parse(paper.content);
            return paper;
        },
        initAnswers: function initAnswers(content) {
            var answers = new Array(content.length);
            content.forEach(function (question, index) {
                if (question.type === 'single') {
                    answers[index] = null;
                } else if (question.type === 'multi') {
                    answers[index] = [];
                } else if (question.type === 'filling') {
                    answers[index] = "";
                }
            });
            return answers;
        },
        isDone: function isDone(answer) {
            if (Array.isArray(answer)) {
                return answer.length > 0;
            }
            return !!answer || answer === 0;
        },
        onInputChange: function onInputChange(event) {
            var index = event.srcElement.dataset.index;
            this.$set(this.boxStatus, index, this.isDone(this.answers[index]));
        },
        onSubmit: function onSubmit() {
            var _this2 = this;

            $.ajax({
                url: this.submitUrl,
                type: 'POST',
                contentType: 'application/json',
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data: JSON.stringify({
                    sheet_id: this.sheetId,
                    answers: this.answers
                }),
                success: function success(data) {
                    if (!data.error) {
                        _this2.showScoreModal(data.score);
                    }
                }
            });
        },
        showModal: function showModal(title, content, onConfirm) {
            this.modalTitle = title;
            this.modalContent = content;
            this.onModalConfirm = onConfirm ? onConfirm : this.dismissModal;
            $('#modal').modal('show');
        },
        showSubmitConfirmModal: function showSubmitConfirmModal() {
            var title = '确认提交？';
            var content = this.doneCount === this.boxStatus.length ? '已完成所有题目！' : '\u90E8\u5206\u9898\u76EE\u5C1A\u672A\u5B8C\u6210\uFF08' + this.doneCount + '/' + this.boxStatus.length + '\uFF09\uFF0C\u662F\u5426\u786E\u8BA4\u63D0\u4EA4\uFF1F';
            var onConfirm = this.onSubmit;
            this.showModal(title, content, onConfirm);
        },
        showScoreModal: function showScoreModal(score) {
            var title = '成绩';
            var content = '\u60A8\u7684\u5206\u6570\u4E3A' + score + '\u5206';
            var onConfirm = function onConfirm() {
                window.location.replace('/myscores');
            };
            this.showModal(title, content, onConfirm);
        },
        dismissModal: function dismissModal() {
            $('#modal').modal('hide');
        }
    },
    //        mounted() {
    //        },
    computed: {
        doneCount: function doneCount() {
            var count = 0;
            for (var i = 0; i < this.boxStatus.length; i++) {
                if (this.boxStatus[i]) {
                    count++;
                }
            }
            return count;
        }
    }
    //        watch: {
    //        }
});

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "wrapper" }, [
    _vm.loadingPaper
      ? _c("div", { staticClass: "text-center" }, [_vm._v("正在载入...")])
      : !_vm.paper
        ? _c("div", { staticClass: "text-center" }, [
            _c(
              "button",
              {
                staticClass: "btn btn-primary btn-lg",
                on: { click: _vm.startTest }
              },
              [_vm._v("开始测试")]
            )
          ])
        : _c("div", { staticClass: "panel" }, [
            _c("div", { staticClass: "panel-heading" }, [
              _c("h3", { staticClass: "text-center" }, [
                _vm._v(_vm._s(_vm.paper.title))
              ]),
              _vm._v(" "),
              _c("h5", { staticClass: "text-center" }, [
                _vm._v(
                  "总分：" +
                    _vm._s(_vm.paper.total_score) +
                    " 限时：" +
                    _vm._s(_vm.paper.time_limit)
                )
              ])
            ]),
            _vm._v(" "),
            _c(
              "div",
              { staticClass: "panel-body" },
              _vm._l(_vm.paper.content, function(item, index) {
                return _c(
                  "div",
                  {
                    staticClass: "row form-group",
                    attrs: { id: "question" + index }
                  },
                  [
                    _c("h5", [
                      _vm._v(
                        _vm._s(index + 1) +
                          ". " +
                          _vm._s(item.question) +
                          "   (" +
                          _vm._s(item.score) +
                          "分)"
                      )
                    ]),
                    _vm._v(" "),
                    _c(
                      "div",
                      [
                        _vm._l(item.options, function(option, n) {
                          return item.type === "single"
                            ? _c("div", { staticClass: "radio" }, [
                                _c("label", [
                                  _c("input", {
                                    directives: [
                                      {
                                        name: "model",
                                        rawName: "v-model",
                                        value: _vm.answers[index],
                                        expression: "answers[index]"
                                      }
                                    ],
                                    attrs: {
                                      type: "radio",
                                      name: "q" + index,
                                      "data-index": index
                                    },
                                    domProps: {
                                      value: n,
                                      checked: _vm._q(_vm.answers[index], n)
                                    },
                                    on: {
                                      change: [
                                        function($event) {
                                          _vm.$set(_vm.answers, index, n)
                                        },
                                        _vm.onInputChange
                                      ]
                                    }
                                  }),
                                  _vm._v(
                                    "\n                            " +
                                      _vm._s(option) +
                                      "\n                        "
                                  )
                                ])
                              ])
                            : _vm._e()
                        }),
                        _vm._v(" "),
                        _vm._l(item.options, function(option, n) {
                          return item.type === "multi"
                            ? _c("div", { staticClass: "checkbox" }, [
                                _c("label", [
                                  _c("input", {
                                    directives: [
                                      {
                                        name: "model",
                                        rawName: "v-model",
                                        value: _vm.answers[index],
                                        expression: "answers[index]"
                                      }
                                    ],
                                    attrs: {
                                      type: "checkbox",
                                      name: "q" + index,
                                      "data-index": index
                                    },
                                    domProps: {
                                      value: n,
                                      checked: Array.isArray(_vm.answers[index])
                                        ? _vm._i(_vm.answers[index], n) > -1
                                        : _vm.answers[index]
                                    },
                                    on: {
                                      change: [
                                        function($event) {
                                          var $$a = _vm.answers[index],
                                            $$el = $event.target,
                                            $$c = $$el.checked ? true : false
                                          if (Array.isArray($$a)) {
                                            var $$v = n,
                                              $$i = _vm._i($$a, $$v)
                                            if ($$el.checked) {
                                              $$i < 0 &&
                                                (_vm.answers[
                                                  index
                                                ] = $$a.concat([$$v]))
                                            } else {
                                              $$i > -1 &&
                                                (_vm.answers[index] = $$a
                                                  .slice(0, $$i)
                                                  .concat($$a.slice($$i + 1)))
                                            }
                                          } else {
                                            _vm.$set(_vm.answers, index, $$c)
                                          }
                                        },
                                        _vm.onInputChange
                                      ]
                                    }
                                  }),
                                  _vm._v(
                                    "\n                            " +
                                      _vm._s(option) +
                                      "\n                        "
                                  )
                                ])
                              ])
                            : _vm._e()
                        }),
                        _vm._v(" "),
                        item.type === "filling"
                          ? _c("div", { staticClass: "form-group" }, [
                              _c("input", {
                                directives: [
                                  {
                                    name: "model",
                                    rawName: "v-model",
                                    value: _vm.answers[index],
                                    expression: "answers[index]"
                                  }
                                ],
                                staticClass: "form-control",
                                attrs: {
                                  type: "text",
                                  name: "q" + index,
                                  "data-index": index
                                },
                                domProps: { value: _vm.answers[index] },
                                on: {
                                  change: _vm.onInputChange,
                                  input: [
                                    function($event) {
                                      if ($event.target.composing) {
                                        return
                                      }
                                      _vm.$set(
                                        _vm.answers,
                                        index,
                                        $event.target.value
                                      )
                                    },
                                    _vm.onInputChange
                                  ]
                                }
                              })
                            ])
                          : _vm._e()
                      ],
                      2
                    )
                  ]
                )
              })
            ),
            _vm._v(" "),
            _c("div", { staticClass: "panel panel-default number-box" }, [
              _c("div", { staticClass: "panel-heading" }, [_vm._v("完成状态")]),
              _vm._v(" "),
              _c("div", { staticClass: "panel-body" }, [
                _c(
                  "div",
                  { staticClass: "numbers" },
                  _vm._l(_vm.boxStatus, function(item, index) {
                    return _c("span", { class: { done: item } }, [
                      _vm._v(
                        "\n                    " +
                          _vm._s(index + 1) +
                          "\n                "
                      )
                    ])
                  })
                )
              ])
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "text-center" }, [
              _c(
                "button",
                {
                  staticClass: "btn btn-primary btn-lg",
                  staticStyle: { width: "200px" },
                  on: { click: _vm.showSubmitConfirmModal }
                },
                [_vm._v("\n                提交\n            ")]
              )
            ]),
            _vm._v(" "),
            _c(
              "div",
              {
                staticClass: "modal fade",
                attrs: { role: "dialog", id: "modal" }
              },
              [
                _c("div", { staticClass: "modal-dialog" }, [
                  _c("div", { staticClass: "modal-content" }, [
                    _c("div", { staticClass: "modal-header" }, [
                      _c(
                        "button",
                        {
                          staticClass: "close",
                          attrs: { "data-dismiss": "modal" }
                        },
                        [_vm._v("×")]
                      ),
                      _vm._v(" "),
                      _c("h4", [_vm._v(_vm._s(_vm.modalTitle))])
                    ]),
                    _vm._v(" "),
                    _c("div", { staticClass: "modal-body" }, [
                      _c("p", [_vm._v(_vm._s(_vm.modalContent))])
                    ]),
                    _vm._v(" "),
                    _c("div", { staticClass: "modal-footer" }, [
                      _c(
                        "button",
                        {
                          staticClass: "btn btn-default",
                          attrs: { "data-dismiss": "modal" }
                        },
                        [_vm._v("取消")]
                      ),
                      _vm._v(" "),
                      _c(
                        "button",
                        {
                          staticClass: "btn btn-primary",
                          attrs: { "data-dismiss": "modal" },
                          on: { click: _vm.onModalConfirm }
                        },
                        [_vm._v("确认")]
                      )
                    ])
                  ])
                ])
              ]
            )
          ])
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-70421e48", module.exports)
  }
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(34)
}
var normalizeComponent = __webpack_require__(2)
/* script */
var __vue_script__ = __webpack_require__(14)
/* template */
var __vue_template__ = __webpack_require__(36)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-3bd98532"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/PaperEditor.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3bd98532", Component.options)
  } else {
    hotAPI.reload("data-v-3bd98532", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 12 */,
/* 13 */,
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    props: {
        paperJson: String,
        url: String
    },
    data: function data() {
        var paper = void 0;
        if (this.paperJson) {
            paper = JSON.parse(this.paperJson);
            paper.questions = JSON.parse(paper.content);
            var answers = JSON.parse(paper.answers);
            paper.questions.forEach(function (item, index) {
                item.answer = answers[index];
                item.title = item.question;
            });
        } else {
            paper = {
                title: '',
                time_limit: 60,
                questions: [],
                answers: []
            };
        }

        return {
            paper: paper,
            addingQuestion: false
        };
    },

    methods: {
        loadPaper: function loadPaper() {},
        addQuestion: function addQuestion() {
            this.addingQuestion = true;
        },
        onQuestionCancel: function onQuestionCancel() {
            this.addingQuestion = false;
        },
        onCreateQuestion: function onCreateQuestion(question) {
            this.paper.questions.push(question);
            this.addingQuestion = false;
        },
        onSaveQuestion: function onSaveQuestion(id, question) {
            this.$set(this.paper.questions, id, question);
        },
        onRemoveQuestion: function onRemoveQuestion(id) {
            this.paper.questions.splice(id, 1);
        },
        onQuestionUp: function onQuestionUp(id) {
            if (id === 0) {
                return;
            }
            var questions = this.paper.questions;
            var temp = questions[id];
            this.$set(questions, id, questions[id - 1]);
            this.$set(questions, id - 1, temp);
        },
        onQuestionDown: function onQuestionDown(id) {
            var questions = this.paper.questions;
            if (id === questions.length - 1) {
                return;
            }
            var temp = questions[id];
            this.$set(questions, id, questions[id + 1]);
            this.$set(questions, id + 1, temp);
        },
        save: function save() {
            var _this = this;

            var url = this.paper.id ? '/papers/' + this.paper.id : '/papers/store';
            var answers = [];
            var questions = this.paper.questions.map(function (item) {
                answers.push(item.answer);
                return {
                    question: item.title,
                    type: item.type,
                    score: item.score,
                    options: item.options
                };
            });
            axios({
                url: url,
                method: 'put',
                data: {
                    title: this.paper.title,
                    time_limit: this.paper.time_limit,
                    questions: questions,
                    answers: answers
                },
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            }).then(function (response) {
                if (!response.data.error) {
                    _this.$message({
                        message: _this.paper.id ? '保存成功' : '创建成功',
                        type: 'success'
                    });
                } else {
                    _this.$message({
                        message: _this.paper.id ? '保存失败' : '创建失败',
                        type: 'error'
                    });
                }
            });
        }
    }
});

/***/ }),
/* 15 */,
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(28)
}
var normalizeComponent = __webpack_require__(2)
/* script */
var __vue_script__ = __webpack_require__(19)
/* template */
var __vue_template__ = __webpack_require__(27)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-417b5bc6"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/Question.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-417b5bc6", Component.options)
  } else {
    hotAPI.reload("data-v-417b5bc6", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 17 */,
/* 18 */,
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    props: {
        question: Object,
        answer: [Number, Array],
        edit: Boolean,
        id: Number
    },
    data: function data() {
        var _this = this;

        var options = [];
        var answer = {
            multi: [],
            single: null
        };
        if (this.question) {
            options = this.question.options.map(function (item, index) {
                return {
                    value: item,
                    editing: false,
                    tempText: null
                };
            });

            answer[this.question.type] = this.question.answer;
        }
        var validateScore = function validateScore(role, value, callback) {
            var reg = /^[0-9]*[1-9][0-9]*$/;
            if (!reg.test(value)) {
                callback(new Error('请输入一个大于0的整数'));
            } else {
                callback();
            }
        };
        var validateOptions = function validateOptions(rule, value, callback) {
            if (_this.form.options.length === 0) {
                callback(new Error('请提供答案选项'));
                return;
            }

            var type = _this.form.type;
            var answer = _this.form.answer;
            if (type === 'single' && typeof answer.single !== 'number' || type === 'multi' && answer.multi.length === 0) {
                callback(new Error('请选择答案'));
            } else {
                callback();
            }
        };
        return {
            form: {
                title: this.question ? this.question.title : '',
                type: this.question ? this.question.type : 'single',
                score: this.question ? this.question.score : 5,
                options: options,
                answer: answer
            },
            rules: {
                title: [{ required: true, message: '请输入题目', trigger: 'blur' }],
                type: [{ required: true, message: '请选择类型', trigger: 'change' }],
                score: [{ required: true, message: '请输入分数', trigger: 'blur' }, { validator: validateScore, trigger: 'blur' }],
                options: [{ validator: validateOptions, trigger: 'submit' }]
            },
            typeOptions: {
                single: '单选题',
                multi: '多选题'
            },
            tempOption: null,
            editing: this.edit
        };
    },

    methods: {
        addOption: function addOption() {
            if (!this.tempOption || this.tempOption.length === 0) {
                return;
            }
            this.form.options.push({ value: this.tempOption, editing: false });
            this.tempOption = '';
        },
        removeOption: function removeOption(index) {
            this.form.options.splice(index, 1);

            var multi = this.form.answer.multi;

            var n = multi.indexOf(index);
            if (n >= 0) {
                multi.splice(n, 1);
                for (var i = 0; i < multi.length; i++) {
                    var option = multi[i];
                    if (option > index) {
                        multi[i] = option - 1;
                    }
                }
            }

            if (this.form.answer.single === index) {
                this.form.answer.single = null;
            } else if (this.form.answer.single > index) {
                this.form.answer.single--;
            }
        },
        editOption: function editOption(index) {
            var item = this.form.options[index];
            item.editing = true;
            item.tempText = item.value;
        },
        saveOption: function saveOption(item) {
            item.editing = false;
            item.value = item.tempText;
        },
        optionUp: function optionUp(index) {
            if (index <= 0) {
                return;
            }
            var options = this.form.options;
            var multi = this.form.answer.multi;
            var temp = options[index];

            this.$set(options, index, options[index - 1]);
            this.$set(options, index - 1, temp);

            var upChecked = multi.indexOf(index - 1);
            var downChecked = multi.indexOf(index);
            if (downChecked >= 0 && upChecked < 0) {
                this.$set(multi, downChecked, index - 1);
            } else if (downChecked < 0 && upChecked >= 0) {
                this.$set(multi, upChecked, index);
            }

            if (this.form.answer.single === index) {
                this.form.answer.single = index - 1;
            } else if (this.form.answer.single === index - 1) {
                this.form.answer.single = index;
            }
        },
        optionDown: function optionDown(index) {
            if (index >= this.form.options.length - 1) {
                return;
            }

            var options = this.form.options;
            var multi = this.form.answer.multi;
            var temp = options[index];

            this.$set(options, index, options[index + 1]);
            this.$set(options, index + 1, temp);

            var upChecked = multi.indexOf(index);
            var downChecked = multi.indexOf(index + 1);
            if (downChecked >= 0 && upChecked < 0) {
                this.$set(multi, downChecked, index);
            } else if (downChecked < 0 && upChecked >= 0) {
                this.$set(multi, upChecked, index + 1);
            }

            if (this.form.answer.single === index) {
                this.form.answer.single = index + 1;
            } else if (this.form.answer.single === index + 1) {
                this.form.answer.single = index;
            }
        },
        save: function save() {
            var _this2 = this;

            this.$refs.form.validate(function (valid) {
                if (valid) {
                    if (_this2.question) {
                        _this2.$emit('save', _this2.id, {
                            title: _this2.form.title,
                            type: _this2.form.type,
                            score: _this2.form.score,
                            options: _this2.form.options.map(function (item) {
                                return item.value;
                            }),
                            answer: _this2.form.answer[_this2.form.type]
                        });
                        _this2.editing = false;
                    } else {
                        _this2.$emit('create', {
                            title: _this2.form.title,
                            type: _this2.form.type,
                            score: _this2.form.score,
                            options: _this2.form.options.map(function (item) {
                                return item.value;
                            }),
                            answer: _this2.form.answer[_this2.form.type]
                        });
                        _this2.reset();
                    }
                } else {
                    console.log('error');
                    return false;
                }
            });
        },
        cancel: function cancel() {
            if (typeof this.id === 'number') {
                this.editing = false;
            } else {
                this.reset();
                this.$emit('cancel');
            }
        },
        reset: function reset() {
            this.form = {
                title: '',
                type: 'single',
                score: 5,
                options: [],
                answer: {
                    single: null,
                    multi: []
                }
            };
            this.tempOption = '';
        },
        questionUp: function questionUp() {
            this.$emit('up', this.id);
        },
        questionDown: function questionDown() {
            this.$emit('down', this.id);
        },
        editQuestion: function editQuestion() {
            this.editing = true;
        },
        removeQuestion: function removeQuestion() {
            this.$emit('remove', this.id);
        }
    },
    watch: {
        question: function question(val) {
            this.form = {
                title: val.title,
                type: val.type,
                score: val.score,
                options: val.options.map(function (item) {
                    return {
                        value: item,
                        editing: false,
                        tempText: null
                    };
                }),
                answer: {
                    single: val.type === 'single' ? val.answer : null,
                    multi: val.type === 'multi' ? val.answer : []
                }
            };
        },
        edit: function edit(val) {
            this.editing = val;
        }
    }
});

/***/ }),
/* 20 */,
/* 21 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      !_vm.editing
        ? _c(
            "div",
            { staticClass: "normal" },
            [
              _c("div", { staticClass: "operations" }, [
                _c("i", {
                  staticClass: "el-icon-arrow-up",
                  on: { click: _vm.questionUp }
                }),
                _vm._v(" "),
                _c("i", {
                  staticClass: "el-icon-arrow-down",
                  on: { click: _vm.questionDown }
                }),
                _vm._v(" "),
                _c("i", {
                  staticClass: "el-icon-edit",
                  on: { click: _vm.editQuestion }
                }),
                _vm._v(" "),
                _c("i", {
                  staticClass: "el-icon-delete",
                  on: { click: _vm.removeQuestion }
                })
              ]),
              _vm._v(" "),
              _c("p", [
                _vm._v(
                  _vm._s(_vm.id + 1) +
                    ". " +
                    _vm._s(_vm.question.title) +
                    " (" +
                    _vm._s(_vm.question.score) +
                    "分)"
                )
              ]),
              _vm._v(" "),
              _vm.question.type === "single"
                ? _c(
                    "el-radio-group",
                    {
                      model: {
                        value: _vm.question.answer,
                        callback: function($$v) {
                          _vm.$set(_vm.question, "answer", $$v)
                        },
                        expression: "question.answer"
                      }
                    },
                    _vm._l(_vm.question.options, function(option, num) {
                      return _c(
                        "el-radio",
                        {
                          key: num,
                          attrs: {
                            name: "radio" + _vm.id,
                            label: num,
                            disabled: ""
                          }
                        },
                        [
                          _vm._v(
                            "\n                " +
                              _vm._s(option) +
                              "\n            "
                          )
                        ]
                      )
                    })
                  )
                : _vm._e(),
              _vm._v(" "),
              _vm.question.type === "multi"
                ? _c(
                    "el-checkbox-group",
                    {
                      model: {
                        value: _vm.question.answer,
                        callback: function($$v) {
                          _vm.$set(_vm.question, "answer", $$v)
                        },
                        expression: "question.answer"
                      }
                    },
                    _vm._l(_vm.question.options, function(option, num) {
                      return _c(
                        "el-checkbox",
                        {
                          key: num,
                          attrs: {
                            name: "checkbox" + _vm.id,
                            label: num,
                            disabled: ""
                          }
                        },
                        [
                          _vm._v(
                            "\n                " +
                              _vm._s(option) +
                              "\n            "
                          )
                        ]
                      )
                    })
                  )
                : _vm._e()
            ],
            1
          )
        : _vm._e(),
      _vm._v(" "),
      _vm.editing
        ? _c(
            "el-card",
            { staticClass: "editor" },
            [
              _c(
                "el-form",
                {
                  ref: "form",
                  attrs: {
                    model: _vm.form,
                    "label-width": "80px",
                    rules: _vm.rules,
                    size: "small"
                  }
                },
                [
                  _c(
                    "el-form-item",
                    { attrs: { label: "题目", prop: "title" } },
                    [
                      _c("el-input", {
                        model: {
                          value: _vm.form.title,
                          callback: function($$v) {
                            _vm.$set(_vm.form, "title", $$v)
                          },
                          expression: "form.title"
                        }
                      })
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "el-form-item",
                    { attrs: { label: "类型", prop: "type" } },
                    [
                      _c(
                        "el-select",
                        {
                          attrs: { placeholder: "请选择题目类型" },
                          model: {
                            value: _vm.form.type,
                            callback: function($$v) {
                              _vm.$set(_vm.form, "type", $$v)
                            },
                            expression: "form.type"
                          }
                        },
                        [
                          _c("el-option", {
                            attrs: { label: "单选题", value: "single" }
                          }),
                          _vm._v(" "),
                          _c("el-option", {
                            attrs: { label: "多选题", value: "multi" }
                          })
                        ],
                        1
                      )
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "el-form-item",
                    { attrs: { label: "分数", prop: "score" } },
                    [
                      _c("el-input", {
                        model: {
                          value: _vm.form.score,
                          callback: function($$v) {
                            _vm.$set(_vm.form, "score", $$v)
                          },
                          expression: "form.score"
                        }
                      })
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "el-form-item",
                    { attrs: { label: "选项", prop: "options" } },
                    [
                      _vm.form.options.length > 0 && _vm.form.type === "multi"
                        ? _c(
                            "el-checkbox-group",
                            {
                              staticStyle: { width: "100%" },
                              model: {
                                value: _vm.form.answer.multi,
                                callback: function($$v) {
                                  _vm.$set(_vm.form.answer, "multi", $$v)
                                },
                                expression: "form.answer.multi"
                              }
                            },
                            _vm._l(_vm.form.options, function(item, index) {
                              return _c(
                                "div",
                                { key: item.value },
                                [
                                  _c(
                                    "el-checkbox",
                                    { attrs: { name: "single", label: index } },
                                    [_vm._v(_vm._s(item.value))]
                                  ),
                                  _vm._v(" "),
                                  _c("div", { staticClass: "operations" }, [
                                    _c("i", {
                                      staticClass: "el-icon-arrow-up",
                                      on: {
                                        click: function($event) {
                                          _vm.optionUp(index)
                                        }
                                      }
                                    }),
                                    _vm._v(" "),
                                    _c("i", {
                                      staticClass: "el-icon-arrow-down",
                                      on: {
                                        click: function($event) {
                                          _vm.optionDown(index)
                                        }
                                      }
                                    }),
                                    _vm._v(" "),
                                    _c("i", {
                                      staticClass: "el-icon-edit",
                                      on: {
                                        click: function($event) {
                                          _vm.editOption(index)
                                        }
                                      }
                                    }),
                                    _vm._v(" "),
                                    _c("i", {
                                      staticClass: "el-icon-delete",
                                      on: {
                                        click: function($event) {
                                          _vm.removeOption(index)
                                        }
                                      }
                                    })
                                  ]),
                                  _vm._v(" "),
                                  item.editing
                                    ? _c(
                                        "div",
                                        [
                                          _c("el-input", {
                                            model: {
                                              value: item.tempText,
                                              callback: function($$v) {
                                                _vm.$set(item, "tempText", $$v)
                                              },
                                              expression: "item.tempText"
                                            }
                                          }),
                                          _vm._v(" "),
                                          _c(
                                            "el-button",
                                            {
                                              staticStyle: {
                                                "margin-top": "6px"
                                              },
                                              attrs: {
                                                type: "primary",
                                                size: "small"
                                              },
                                              on: { click: _vm.saveOption }
                                            },
                                            [_vm._v("保存")]
                                          )
                                        ],
                                        1
                                      )
                                    : _vm._e()
                                ],
                                1
                              )
                            })
                          )
                        : _vm._e(),
                      _vm._v(" "),
                      _vm.form.options.length > 0 && _vm.form.type === "single"
                        ? _c(
                            "el-radio-group",
                            {
                              staticStyle: { width: "100%" },
                              model: {
                                value: _vm.form.answer.single,
                                callback: function($$v) {
                                  _vm.$set(_vm.form.answer, "single", $$v)
                                },
                                expression: "form.answer.single"
                              }
                            },
                            _vm._l(_vm.form.options, function(item, index) {
                              return _c(
                                "div",
                                { key: item.value },
                                [
                                  _c(
                                    "el-radio",
                                    { attrs: { label: index, name: "multi" } },
                                    [_vm._v(_vm._s(item.value))]
                                  ),
                                  _vm._v(" "),
                                  _c("div", { staticClass: "operations" }, [
                                    _c("i", {
                                      staticClass: "el-icon-arrow-up",
                                      on: {
                                        click: function($event) {
                                          _vm.optionUp(index)
                                        }
                                      }
                                    }),
                                    _vm._v(" "),
                                    _c("i", {
                                      staticClass: "el-icon-arrow-down",
                                      on: {
                                        click: function($event) {
                                          _vm.optionDown(index)
                                        }
                                      }
                                    }),
                                    _vm._v(" "),
                                    !item.editing
                                      ? _c("i", {
                                          staticClass: "el-icon-edit",
                                          on: {
                                            click: function($event) {
                                              _vm.editOption(index)
                                            }
                                          }
                                        })
                                      : _vm._e(),
                                    _vm._v(" "),
                                    _c("i", {
                                      staticClass: "el-icon-delete",
                                      on: {
                                        click: function($event) {
                                          _vm.removeOption(index)
                                        }
                                      }
                                    })
                                  ]),
                                  _vm._v(" "),
                                  item.editing
                                    ? _c(
                                        "div",
                                        [
                                          _c("el-input", {
                                            model: {
                                              value: item.tempText,
                                              callback: function($$v) {
                                                _vm.$set(item, "tempText", $$v)
                                              },
                                              expression: "item.tempText"
                                            }
                                          }),
                                          _vm._v(" "),
                                          _c(
                                            "el-button",
                                            {
                                              staticStyle: { margin: "6px 0" },
                                              attrs: {
                                                type: "primary",
                                                size: "small"
                                              },
                                              on: { click: _vm.saveOption }
                                            },
                                            [_vm._v("保存")]
                                          )
                                        ],
                                        1
                                      )
                                    : _vm._e()
                                ],
                                1
                              )
                            })
                          )
                        : _vm._e(),
                      _vm._v(" "),
                      _c("el-input", {
                        attrs: { placeholder: "新选项" },
                        model: {
                          value: _vm.tempOption,
                          callback: function($$v) {
                            _vm.tempOption = $$v
                          },
                          expression: "tempOption"
                        }
                      }),
                      _vm._v(" "),
                      _c(
                        "el-button",
                        {
                          staticStyle: { "margin-top": "12px" },
                          attrs: { type: "primary" },
                          on: { click: _vm.addOption }
                        },
                        [_vm._v("添加")]
                      )
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "el-row",
                    [
                      _c(
                        "el-col",
                        { attrs: { offset: 20, span: 4 } },
                        [
                          _c("el-button", { on: { click: _vm.cancel } }, [
                            _vm._v("取消")
                          ]),
                          _vm._v(" "),
                          _c(
                            "el-button",
                            {
                              attrs: { type: "primary" },
                              on: { click: _vm.save }
                            },
                            [_vm._v("保存")]
                          )
                        ],
                        1
                      )
                    ],
                    1
                  )
                ],
                1
              )
            ],
            1
          )
        : _vm._e()
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-417b5bc6", module.exports)
  }
}

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(29);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("59f46104", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-417b5bc6\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Question.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-417b5bc6\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Question.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "\n.normal[data-v-417b5bc6] {\n  padding: 8px;\n  border-radius: 8px;\n  border: 1px transparent solid;\n}\n.normal[data-v-417b5bc6]:hover {\n    border-color: #409eff;\n    -webkit-box-shadow: 0 0 15px #409eff;\n            box-shadow: 0 0 15px #409eff;\n}\nlabel.el-radio[data-v-417b5bc6], label.el-checkbox[data-v-417b5bc6] {\n  display: block;\n  margin-left: 0 !important;\n  line-height: 20px;\n}\n.editor label.el-radio[data-v-417b5bc6], .editor label.el-checkbox[data-v-417b5bc6] {\n    display: inline-block;\n    line-height: 25px;\n}\nlabel.el-radio[data-v-417b5bc6]:not(:first-child), label.el-checkbox[data-v-417b5bc6]:not(:first-child) {\n    margin-top: 10px;\n}\n.operations[data-v-417b5bc6] {\n  display: inline-block;\n  font-size: 15px;\n  line-height: 25px;\n  float: right;\n}\n.operations i[data-v-417b5bc6] {\n    margin-left: 6px;\n}\n", ""]);

// exports


/***/ }),
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(35);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("4faffbef", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3bd98532\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./PaperEditor.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3bd98532\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./PaperEditor.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "\nlabel.el-radio[data-v-3bd98532], label.el-checkbox[data-v-3bd98532] {\n  display: block;\n  margin-left: 0 !important;\n  line-height: 16px;\n}\nlabel.el-radio[data-v-3bd98532]:not(:first-child), label.el-checkbox[data-v-3bd98532]:not(:first-child) {\n    margin-top: 10px;\n}\n.question[data-v-3bd98532] {\n  margin-bottom: 16px;\n}\n.create[data-v-3bd98532] {\n  margin-top: 12px;\n}\n", ""]);

// exports


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "wrapper" },
    [
      _c(
        "el-form",
        { attrs: { "label-width": "80px", model: _vm.paper } },
        [
          _c(
            "el-form-item",
            { attrs: { label: "标题", prop: "title" } },
            [
              _c("el-input", {
                model: {
                  value: _vm.paper.title,
                  callback: function($$v) {
                    _vm.$set(_vm.paper, "title", $$v)
                  },
                  expression: "paper.title"
                }
              })
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "el-form-item",
            { attrs: { label: "类型", prop: "time" } },
            [
              _c(
                "el-input",
                {
                  model: {
                    value: _vm.paper.time_limit,
                    callback: function($$v) {
                      _vm.$set(_vm.paper, "time_limit", $$v)
                    },
                    expression: "paper.time_limit"
                  }
                },
                [_c("template", { slot: "append" }, [_vm._v("分钟")])],
                2
              )
            ],
            1
          )
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        [
          _vm._l(_vm.paper.questions, function(item, index) {
            return _c(
              "div",
              { key: index, staticClass: "question" },
              [
                _c("question", {
                  attrs: { question: item, id: index },
                  on: {
                    save: _vm.onSaveQuestion,
                    remove: _vm.onRemoveQuestion,
                    up: _vm.onQuestionUp,
                    down: _vm.onQuestionDown
                  }
                })
              ],
              1
            )
          }),
          _vm._v(" "),
          _vm.addingQuestion
            ? _c("question", {
                attrs: { edit: true },
                on: {
                  create: _vm.onCreateQuestion,
                  cancel: _vm.onQuestionCancel
                }
              })
            : _vm._e(),
          _vm._v(" "),
          _c(
            "el-button",
            {
              staticClass: "create",
              attrs: { type: "primary", icon: "el-icon-circle-plus" },
              on: { click: _vm.addQuestion }
            },
            [_vm._v("添加新题目")]
          )
        ],
        2
      ),
      _vm._v(" "),
      _c("hr"),
      _vm._v(" "),
      _c(
        "el-row",
        [
          _c(
            "el-col",
            { attrs: { span: 4, offset: 10 } },
            [
              _c(
                "el-button",
                {
                  attrs: { type: "primary", size: "large" },
                  on: { click: _vm.save }
                },
                [_vm._v("保存试卷")]
              )
            ],
            1
          )
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-3bd98532", module.exports)
  }
}

/***/ })
/******/ ]);