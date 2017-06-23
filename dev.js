var RNI = require('./src/browser');
var native = require('./src/native');

function RNIDev(handle) {
	var createNativeInvoke = native.createNativeInvoke;
	var nativeInvoke;
	console.warn("RNI is web debug mode.");
	window.postMessage = window.TESTINNERRNI.postMessage = function (message) {
		var data;
		try {
			data = JSON.parse(message);
		} catch (e) {

		}
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
	window['originalPostMessage'] = function () {

	};
	handle(nativeInvoke);
};

window.RNIDev = RNIDev;

module.exports = RNIDev;
