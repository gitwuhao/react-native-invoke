'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _messager = require('./messager');

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