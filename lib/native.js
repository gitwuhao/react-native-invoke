'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.createNativeInvoke = createNativeInvoke;

var _messager = require('./messager');

function createNativeInvoke(postMessage) {

	var invoke = (0, _messager.createMessager)(postMessage, function onMessage(event) {}, function onReady(e) {
		this.name = 'native';
		this.postMessage(JSON.stringify({ id: 0, type: "ready" }));
		this.browserData = e.data;
	});

	return invoke;
}