import RNIDev from './dev';

RNIDev(function (nativeInvoke) {
	nativeInvoke.on('camera', function (e) {
		e.error('camera.error');
	});

	nativeInvoke.on('notification/getRegistrationID', function (e) {
		e.success('137akl1234');
	});
});


setTimeout(function () {
	RNI.post({ type: 'camera', data: { a: 1, b: 2, c: 3, } }, function (result) {
		console.info('RNI success response:' + result);
	}, function (result) {
		console.info('RNI error response:' + result);
	});


	RNI.post('notification/getRegistrationID', function (result) {
		console.info('RNI success response:' + result);
	}, function (result) {
		console.info('RNI error response:' + result);
	});
}, 1000);