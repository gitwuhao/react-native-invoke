import EventBus  from './EventBus';

let now = new Date().getTime();
function getUID() {
	return ++now;
}

function noop() {

}

class Messager extends EventBus {

	constructor(postMessage, onMessage, onReady) {
		super();
		this.isReadyState = false;
		this.requestMessageList = [];

		// this.eventBus = new EventBus();

		this.on('ready', function (e) {
			this.isReadyState = true;
			onReady && onReady.bind(this)(e);
		}.bind(this));

		this.on('reply', function (response) {
			let requestMessage = this.requestMessageList[response.sender] || {};
			let fn = requestMessage[response.status];
			fn && fn(response.result)
			if (response.status == 'error') {
				this.onError && this.onError(response);
			}
			delete this.requestMessageList[response.sender];
		}.bind(this));

		this.postMessage = postMessage || noop;

		this.onMessage = onMessage || noop;

	}

	postMessage() {

	}

	onMessage() {

	}

	isReady() {
		return this.isReadyState;
	}

	post(type, success, error) {
		return new Promise(function (resolve, reject) {
			let data;
			if (typeof type === 'string') {
				data = {
					type,
				};
			} else if (type.type) {
				data = type;
			}

			data.id = getUID();
			let messageItem = {
				message: data,
				success:function(result){
					success && success(result);
					resolve(result);
				},
				error:function(err){
					error && error(err);
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
	reply(sender, status, result) {
		try {
			this.postMessage(JSON.stringify({
				sender,
				status,
				result,
			}));
		} catch (e) {
			console.error(e);
		}
	}

	onMessageHandle(e) {
		try {
			let data = JSON.parse(e.data);
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
}

export function createMessager(postMessage, onMessage, onReady) {
	return new Messager(postMessage, onMessage, onReady);
};
