'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.createMessager = createMessager;

var _EventBus2 = require('./EventBus');

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