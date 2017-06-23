var RNI = require('./src/browser');
var native = require('./src/native');

function RNIDev(handle) {
	var createNativeInvoke = native.createNativeInvoke;
	var nativeInvoke;
	console.warn("RNI is web debug mode.");

	//将Web端的消息发送给Native端
	window.postMessage = window.INNERRNI.postMessage = function (message) {
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

	//创建nativeInvoke对象，传递一个将Native消息发送给web端的函数
	nativeInvoke = createNativeInvoke(function (message) {
		//将Native端的消息发送给Web端
		window.INNERRNI.onMessageHandle({
			data: message
		});

		//React Native可以通过webviewComponent.postMessage将消息回传给web端，
		//web端通过document.addEventListener('message', RNI.onMessageHandle.bind(RNI))接收消息;
	});
	window['originalPostMessage'] = function () {

	};
	handle(nativeInvoke);
};

window.RNIDev = RNIDev;

module.exports = RNIDev;
