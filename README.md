
## RNI Web 端 API 文档
在web端通过 RNI (React Native Invoke) 调用平台（android、ios）的API，让Web端能开发出更多业务类型的应用。以请求响应的方式将Native接口封装了

安装
```
npm install --save w-rn-invoke

```

引用
```
import RNI from 'w-rn-invoke/browser';

```

web端调试
```
import RNIDev from './lib/RNI.dev.min.js';

//重写RNI消息传递机制
RNIDev(function (nativeInvoke) {
  //侦听请求并处理
	nativeInvoke.on('camera', function (e) {
		e.error('camera.error');
	});

	nativeInvoke.on('notification/getRegistrationID', function (e) {
		e.success('137akl1234');
	});
});


//测试代码
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
```

这段重写RNI消息传递的代码，需要在web端最先运行，避免业务代码里面的RNI调用报错。

---
### 目录说明
```
[-] rn-invoke
 |-- [-] dist
 |    |-- RNI.browser.dev.min.js (web端调试引用)
 |-- browser.js(es6 web端 引用)
 |-- native.js (es6 RN端 引用)
 |-- webdev.js (示例代码)
```




## API说明


#### RNI.on(eventType,handle)

侦听来自RN的事件，现在只有ready事件

##### 参数
> eventType(String):事件类型
>
> handle(Function(event)): 事件处理函数
>
> > ###### event:{
> >               id: Number,
> >               type: String,
> >               success: Function,
> >               error: Function,
> >               data: Object
> >        }
>

##### 例子
```
RNI.on('deviceInfo', function(e){
  //e.error('deviceInfo error');
  //e.success('deviceInfo success');
});

```

----------

#### RNI.post(request,[success], [error])

向RN发起API调用请求

##### 参数
> request(String|Object):调用API的请求
>
> > ###### Object({type : String , data : Object})
>
> success(Function): 请求成功的回调函数
>
> error(Function): 请求异常的回调函数


##### 例子
```
RNI.post('deviceInfo', function(result){
  //成功
},function(error){
  //失败
});

//  或者

RNI.post({
  type : 'deviceInfo'
}, function(result){
   //成功
},function(error){
  //失败
});
```

----------

