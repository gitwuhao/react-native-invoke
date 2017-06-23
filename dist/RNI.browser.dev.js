/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!****************!*\
  !*** ./dev.js ***!
  \****************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var RNI = __webpack_require__(/*! ./src/browser */ 1);
	var native = __webpack_require__(/*! ./src/native */ 4);
	
	function RNIDev(handle) {
		var createNativeInvoke = native.createNativeInvoke;
		var nativeInvoke;
		console.warn("RNI is web debug mode.");
		window.postMessage = window.TESTINNERRNI.postMessage = function (message) {
			var data;
			try {
				data = JSON.parse(message);
			} catch (e) {}
			if (data && data.type) {
				console.warn('nativeInvoke.onMessage => ' + data.type);
			}
			nativeInvoke.onMessageHandle({
				data: message
			});
		};
	
		nativeInvoke = createNativeInvoke(function (message) {
			window.TESTINNERRNI.onMessageHandle({
				data: message
			});
		});
		window['originalPostMessage'] = function () {};
		handle(nativeInvoke);
	};
	
	window.RNIDev = RNIDev;
	
	module.exports = RNIDev;

/***/ }),
/* 1 */
/*!************************!*\
  !*** ./src/browser.js ***!
  \************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _messager = __webpack_require__(/*! ./messager */ 2);
	
	var RNI = window.RNI;
	(function (factory) {
		if (!RNI) {
			var innerRNI = factory();
			RNI = {
				post: innerRNI.post.bind(innerRNI),
				on: innerRNI.on.bind(innerRNI),
				// once: innerRNI.once.bind(innerRNI),
				// off: innerRNI.off.bind(innerRNI),
				onError: function onError(e) {
					console.error(e);
				}
			};
	
			innerRNI.onError = function (e) {
				window.RNI.onError && window.RNI.onError('RNI error response:' + JSON.stringify(e), e);
			};
			window.RNI = RNI;
			window.TESTINNERRNI = innerRNI;
		}
	})(function () {
		function postMessage(message) {
			if (this.isReadyState) {
				window.postMessage(message);
			} else {
				var item = JSON.parse(message);
				var messageItem = this.requestMessageList[item.id];
				messageItem.isWaitPostMessage = true;
			}
		};
	
		function onMessage(event) {};
	
		RNI = (0, _messager.createMessager)(postMessage, onMessage, function onReady(e) {
			this.name = 'browser';
	
			var list = this.requestMessageList;
	
			for (var key in list) {
				if (!Object.prototype.hasOwnProperty.call(list, key)) {
					return;
				}
				var item = list[key];
				if (item.isWaitPostMessage) {
					this.postMessage(JSON.stringify(item.message));
					delete item.isWaitPostMessage;
				}
			}
		});
		document.addEventListener('message', RNI.onMessageHandle.bind(RNI));
	
		function ready() {
			window.postMessage(JSON.stringify({
				id: 0,
				type: "ready",
				data: {
					historyLength: window.history.length,
					href: window.location.href,
					title: document.title
				}
			}));
		}
	
		var originalPostMessage = window['originalPostMessage'];
		if (originalPostMessage) {
			ready();
		} else {
			Object.defineProperty(window, 'originalPostMessage', {
				get: function get() {
					return originalPostMessage;
				},
				set: function set(value) {
					originalPostMessage = value;
					if (originalPostMessage) {
						setTimeout(ready, 50);
					}
				}
			});
		}
		return RNI;
	});
	
	exports.default = RNI;

/***/ }),
/* 2 */
/*!*************************!*\
  !*** ./src/messager.js ***!
  \*************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	exports.createMessager = createMessager;
	
	var _EventBus2 = __webpack_require__(/*! ./EventBus */ 3);
	
	var _EventBus3 = _interopRequireDefault(_EventBus2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var now = new Date().getTime();
	function getUID() {
		return ++now;
	}
	
	function noop() {}
	
	var Messager = function (_EventBus) {
		_inherits(Messager, _EventBus);
	
		function Messager(postMessage, onMessage, onReady) {
			_classCallCheck(this, Messager);
	
			var _this = _possibleConstructorReturn(this, (Messager.__proto__ || Object.getPrototypeOf(Messager)).call(this));
	
			_this.isReadyState = false;
			_this.requestMessageList = [];
	
			// this.eventBus = new EventBus();
	
			_this.on('ready', function (e) {
				this.isReadyState = true;
				onReady && onReady.bind(this)(e);
			}.bind(_this));
	
			_this.on('reply', function (response) {
				var requestMessage = this.requestMessageList[response.sender] || {};
				var fn = requestMessage[response.status];
				fn && fn(response.result);
				if (response.status == 'error') {
					this.onError && this.onError(response);
				}
				delete this.requestMessageList[response.sender];
			}.bind(_this));
	
			_this.postMessage = postMessage || noop;
	
			_this.onMessage = onMessage || noop;
	
			return _this;
		}
	
		_createClass(Messager, [{
			key: 'postMessage',
			value: function postMessage() {}
		}, {
			key: 'onMessage',
			value: function onMessage() {}
		}, {
			key: 'isReady',
			value: function isReady() {
				return this.isReadyState;
			}
		}, {
			key: 'post',
			value: function post(type, _success, _error) {
				return new Promise(function (resolve, reject) {
					var data = void 0;
					if (typeof type === 'string') {
						data = {
							type: type
						};
					} else if (type.type) {
						data = type;
					}
	
					data.id = getUID();
					var messageItem = {
						message: data,
						success: function success(result) {
							_success && _success(result);
							resolve(result);
						},
						error: function error(err) {
							_error && _error(err);
							reject(err);
						}
					};
					this.requestMessageList[data.id] = messageItem;
					this.postMessage(JSON.stringify(data));
				}.bind(this));
			}
	
			//	on(eventType, handle) {
			// if (this.eventBus.eventListeners[eventType]) {
			// 	throw Error(`event ${eventType}  repeat binding`);
			// }
			//this.eventBus.addEventListener(eventType, handle);
			//	}
	
			/*
	   off(eventType, handle) {
	   this.eventBus.removeEventListener(eventType, handle);
	   }
	   */
	
		}, {
			key: 'reply',
			value: function reply(sender, status, result) {
				try {
					this.postMessage(JSON.stringify({
						sender: sender,
						status: status,
						result: result
					}));
				} catch (e) {
					console.error(e);
				}
			}
		}, {
			key: 'onMessageHandle',
			value: function onMessageHandle(e) {
				try {
					var data = JSON.parse(e.data);
					if (data.sender) {
						this.emit('reply', data);
					} else if (data.type) {
						data.success = this.reply.bind(this, data.id, 'success');
						data.error = this.reply.bind(this, data.id, 'error');
						this.emit(data.type, data);
					}
					this.onMessage(e);
				} catch (e) {
					console.error(e);
				}
			}
		}]);
	
		return Messager;
	}(_EventBus3.default);
	
	function createMessager(postMessage, onMessage, onReady) {
		return new Messager(postMessage, onMessage, onReady);
	};

/***/ }),
/* 3 */
/*!*************************!*\
  !*** ./src/EventBus.js ***!
  \*************************/
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var EventBus = function () {
		function EventBus() {
			_classCallCheck(this, EventBus);
	
			this.eventListeners = {};
		}
	
		_createClass(EventBus, [{
			key: "on",
			value: function on(name, cb) {
				var fns = this.eventListeners[name] || [];
				if (fns.indexOf(cb) < 0) {
					fns.push(cb);
				}
				this.eventListeners[name] = fns;
			}
		}, {
			key: "once",
			value: function once(name, cb) {
				cb.isOnce = true;
				this.on(name, cb);
			}
		}, {
			key: "off",
			value: function off(name, cb) {
				var fns = this.eventListeners[name] || [];
				if (cb) {
					var idx = fns.indexOf(cb);
					if (idx >= 0) {
						fns.splice(idx, 1);
					}
				} else {
					delete this.eventListeners[name];
				}
			}
		}, {
			key: "emit",
			value: function emit(name, event) {
				var fns = this.eventListeners[name] || [];
				if (fns.length == 0) {
					//console.warn(`no find event type ${name}...`);
					return;
				}
				var newFnArray = [];
				fns.forEach(function (fn) {
					fn(event);
					if (!fn.isOnce) {
						newFnArray.push(fn);
					}
				});
	
				this.eventListeners[name] = newFnArray;
			}
		}]);
	
		return EventBus;
	}();
	
	exports.default = EventBus;

/***/ }),
/* 4 */
/*!***********************!*\
  !*** ./src/native.js ***!
  \***********************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.createNativeInvoke = createNativeInvoke;
	
	var _messager = __webpack_require__(/*! ./messager */ 2);
	
	function createNativeInvoke(postMessage) {
	
		var invoke = (0, _messager.createMessager)(postMessage, function onMessage(event) {}, function onReady(e) {
			this.name = 'native';
			this.postMessage(JSON.stringify({ id: 0, type: "ready" }));
			this.browserData = e.data;
		});
	
		return invoke;
	}

/***/ })
/******/ ]);
//# sourceMappingURL=RNI.browser.dev.js.map