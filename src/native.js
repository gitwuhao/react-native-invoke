import { createMessager } from './messager';

export function createNativeInvoke(postMessage) {

	let invoke = createMessager(postMessage, function onMessage(event) {

	}, function onReady(e) {
		this.name = 'native';
		this.postMessage(JSON.stringify({ id: 0, type: "ready" }));
		this.browserData = e.data;
	});

	return invoke;
}
