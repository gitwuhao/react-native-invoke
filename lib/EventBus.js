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