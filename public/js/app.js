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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(11);


/***/ }),
/* 1 */
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

Vue.component('paper-component', __webpack_require__(2));

// $.ajaxSetup({
//     headers: {
//         'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
//     }
// });

// const app = new Vue({
//     el: '#app'
// });

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(3)
}
var normalizeComponent = __webpack_require__(8)
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(4);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(6)("6b36edec", content, false);
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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(5)(undefined);
// imports


// module
exports.push([module.i, "\n.wrapper[data-v-70421e48] {\n  max-width: 700px;\n  margin: 0 auto;\n}\n.number-box[data-v-70421e48] {\n  position: fixed;\n  right: 40px;\n  top: 150px;\n  width: 250px;\n}\n.number-box .numbers[data-v-70421e48] {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -ms-flex-wrap: wrap;\n        flex-wrap: wrap;\n    margin-left: -6px;\n    margin-right: -6px;\n}\n.number-box span[data-v-70421e48] {\n    display: inline-block;\n    width: 32px;\n    height: 32px;\n    line-height: 32px;\n    border: 1px solid #979797;\n    border-radius: 50%;\n    text-align: center;\n    margin: 6px;\n}\n.number-box span.done[data-v-70421e48] {\n      background-color: #1cc091;\n}\n", ""]);

// exports


/***/ }),
/* 5 */
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
/* 6 */
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

var listToStyles = __webpack_require__(7)

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
/* 7 */
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
/* 8 */
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
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);