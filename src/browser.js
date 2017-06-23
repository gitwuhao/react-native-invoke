import { createMessager } from './messager';
let RNI = window.RNI;
(function (factory) {
	if (!RNI) {
		let innerRNI = factory();
		RNI = {
			post: innerRNI.post.bind(innerRNI),
			on: innerRNI.on.bind(innerRNI),
			// once: innerRNI.once.bind(innerRNI),
			// off: innerRNI.off.bind(innerRNI),
			onError: function (e) {
				console.error(e);
			}
		};

		innerRNI.onError = function (e) {
			window.RNI.onError && window.RNI.onError(`RNI error response:${JSON.stringify(e)}`, e);
		};
		window.RNI = RNI;
		window.TESTINNERRNI = innerRNI;
	}
})
(function () {
	function postMessage(message) {
		if (this.isReadyState) {
			window.postMessage(message);
		} else {
			let item = JSON.parse(message);
			let messageItem = this.requestMessageList[item.id];
			messageItem.isWaitPostMessage = true;
		}
	};

	function onMessage(event) {

	};

	RNI = createMessager(postMessage, onMessage, function onReady(e) {
		this.name = 'browser';

		let list = this.requestMessageList;

		for (let key in list) {
			if (!Object.prototype.hasOwnProperty.call(list, key)) {
				return;
			}
			let item = list[key];
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
				title: document.title,
			}
		}));
	}

	let originalPostMessage = window['originalPostMessage'];
	if (originalPostMessage) {
		ready()
	} else {
		Object.defineProperty(window, 'originalPostMessage', {
			get: function () {
				return originalPostMessage
			},
			set: function (value) {
				originalPostMessage = value;
				if (originalPostMessage) {
					setTimeout(ready, 50);
				}
			}
		});
	}
	return RNI;
});

export default RNI;
