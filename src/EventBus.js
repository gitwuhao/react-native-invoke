export default class EventBus {
	constructor() {
		this.eventListeners = {};
	}

	on(name, cb) {
		const fns = this.eventListeners[name] || [];
		if (fns.indexOf(cb) < 0) {
			fns.push(cb);
		}
		this.eventListeners[name] = fns;
	}

	once(name, cb) {
		cb.isOnce = true;
		this.on(name, cb);
	}

	off(name, cb) {
		const fns = this.eventListeners[name] || [];
		if (cb) {
			const idx = fns.indexOf(cb)
			if (idx >= 0) {
				fns.splice(idx, 1);
			}
		} else {
			delete this.eventListeners[name];
		}
	}

	emit(name, event) {
		const fns = this.eventListeners[name] || [];
		if (fns.length == 0) {
			//console.warn(`no find event type ${name}...`);
			return;
		}
		let newFnArray = [];
		fns.forEach(function (fn) {
			fn(event);
			if (!fn.isOnce) {
				newFnArray.push(fn);
			}
		});

		this.eventListeners[name] = newFnArray;
	}

}
