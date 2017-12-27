
## RNI Web 端 API 文档
在web端通过 RNI (React Native Invoke) 调用平台（android、ios）的API，让Web端能开发出更多业务类型的应用。

安装
```
npm install --save w-rn-invoke

```

引用
```
import RNI  from "w-rn-invoke/lib/browser";

```

当需要在web端模拟Native接口，便于前端在浏览器端开发调试的时候用下面示例代码。
```
//import RNIDev from 'w-rn-invoke/lib/web.dev';
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
 |-- [-] lib 
 |    |-- browser.min.js (require web端 引用 完整)
 |    |-- native.min.js
 |    |-- RNI.dev.min.js (require web端调试 引用 完整)
 |-- browser.js(es6 web端 引用)
 |-- native.js (es6 RN端 引用)
 |-- webdev.js (示例代码)
```




## 浏览器端API说明


#### RNI.ready(handle)

侦听RNI ready

##### 参数
> handle(Function): 事件处理函数
>

##### 例子
```
RNI.ready(function(result){
  
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

//  Promise

RNI.post({
    type: 'camera'
}).then(function(result) {
    //成功
}).catch(function(error) {
    //失败
});
```

----------



### API汇总
|   Type                                    | Description           | 模块           |
| ----------------------------------------- |:----------------------|:----------------------|
| [deviceInfo](#deviceinfo)                 | 设备信息                |w-snail-modules-device-info   |
| [takePicture](#takepicture)               | 拍照                   |w-snail-modules-take-picture  |
| [notification](#notification)             | 系统通知                |w-snail-modules-notification               |
| [qrCodeRead](#qrcoderead)                 | 扫码（二维码、条形码）     |w-snail-modules-barcode     |
| [linking](#linking)                       | 打开其他App             |w-snail-modules-linking            |
| [clearCache](#clearcache)                 | 清除缓存                |w-rn-snail-core                |
| [getAppInfo](#getappinfo)                 | 获取App信息                |w-rn-snail-core                |
| [startDevEnvironment](#startdevenvironment)| 启用开发者模式                |w-rn-snail-core                |
| [stopDevEnvironment](#stopdevenvironment)  | 停用开发者模式                |w-rn-snail-core                |


---


#### deviceInfo
获取设备信息

##### `RNI.post('deviceInfo',[success], [error])`

##### 参数
> `request(String):`调用API的请求
>
> `success( Function( result ) ) :` 请求成功的回调函数
> > `result :` 返回结果
>
> `error( Function( error ) ) :` 请求异常的回调函数
> > `error :` 返回错误


##### 例子
```
RNI.post('deviceInfo', function(result){
  //成功
},function(error){
  //失败
});
```

##### result
```
{
  "model": "Nexus 5",
  "instanceId": "ebb2qIxF1Gc",
  "isTablet": false,
  "systemVersion": "6.0.1",
  "systemName": "Android",
  "userAgent": "Dalvik/2.1.0 (Linux; U; Android 6.0.1; Nexus 5 Build/MOB30Z)",
  "brand": "google",
  "systemManufacturer": "LGE",
  "uniqueId": "af3c3da35d87f4cb",
  "deviceCountry": "CN",
  "appVersion": "1.0",
  "timezone": "Asia/Shanghai",
  "buildNumber": 1,
  "deviceId": "hammerhead",
  "isEmulator": false,
  "deviceName": "Nexus 5",
  "buildVersion": "not available",
  "deviceLocale": "zh-CN",
  "bundleId": "com.snail",
  "IMEI": "357478061396765"
}
```

----------




#### takePicture
拍照

##### `RNI.post('takePicture',[success], [error])`

##### 参数
> `request(String):`调用API的请求
>
> `success( Function( result ) ) :` 请求成功的回调函数
> > `result :` 返回照片的JEPG Base64数据
>
> `error( Function( error ) ) :` 请求异常的回调函数
> > `error :` 返回错误


##### 例子
```
RNI.post('takePicture', function(result){
  //成功
  //<img src={result} />
},function(error){
  //失败
});
```

----------




#### notification
发出系统通知

##### `RNI.post(notifyRequest,[success], [error])`

##### 参数
> `notifyRequest(Object):` 调用API的请求
> > ```
> > {
> >      type: 'notification',
> >      data: {
> >        title: 标题,
> >        message: 消息,
> >        redirect: 回调url,
> >        playSound: 提示音
> >      }
> >  }
> >  ```
> `success( Function( result ) ) :` 请求成功的回调函数
>
> `error( Function( error ) ) :` 请求异常的回调函数


##### 例子
```
RNI.post({
  type: 'notification',
  data: {
    title: 'app提示',
    message: '消息1',
    redirect: '/login',
    playSound: true
  }
});
```

----------



#### getRegistrationID
获取JPush的registrationID

##### `RNI.post('notification/getRegistrationID',[success], [error])`

----------



#### qrCodeRead
调用扫码功能，只能扫条形码和二维码

##### `RNI.post('qrCodeRead',[success], [error])`

##### 参数
> `request(String):`调用API的请求
>
> `success( Function( result ) ) :` 请求成功的回调函数
> > `result :` 返回数据
> > ```
> > {
> >      type: 类型,//['qr', 'ean13', 'ean8']
> >      code: 代码
> >  }
> >  ```
> `error( Function( error ) ) :` 请求异常的回调函数
> > `error :` 返回错误


##### 例子
```
RNI.post('qrCodeRead', function(result){
  //成功
  //result.code
},function(error){
  //失败
});
```

----------




#### linking
发出系统通知

##### `RNI.post(linkingRequest, [success], [error])`

##### 参数
> `linkingRequest(Object):` 调用API的请求
> > ```
> > {
> >      type: 'linking',
> >      data: {
> >        url: APP链接,[tel:号码,smsto:号码,mailto:地址]
> >      }
> >  }
> >  ```
> `success( Function( result ) ) :` 请求成功的回调函数
>
> `error( Function( error ) ) :` 请求异常的回调函数


##### 例子
```
RNI.post({
  type: 'linking',
  data: {
    url: 'tel:18585025253',
  }
});
```

----------



#### clearCache
`RNI.post('clearCache')`
清除缓存

##### 例子
```
RNI.post('clearCache');
```

----------




#### getAppInfo
获取App信息

##### `RNI.post('getAppInfo',[success], [error])`


##### 例子
```
RNI.post('getAppInfo', function(result){
  //成功
},function(error){
  //失败
});
```

##### result
```
{
	"buildTimeStamp": 1501816943920,
	"buildDateTime": "2017-08-04 11:22:23",
	"version": "1.0.0",
	"name": "w-dev-snail-app",
	//只有开发模式会有这个属性
	"isDevEnv": true
}
```

----------


#### startDevEnvironment
启用开发者模式	

##### `RNI.post(startDevEnvironment,[success], [error])`

##### 参数
> `startDevEnvironment(Object):` 调用API的请求
> > ```
> > {
> >      type: 'startDevEnvironment',
> >      data: {
> >        url: 需要切换环境的URL,
> >      }
> >  }
> >  ```
> `success( Function( result ) ) :` 请求成功的回调函数
>
> `error( Function( error ) ) :` 请求异常的回调函数


##### 例子
```
RNI.post({
  type: 'startDevEnvironment',
  data: {
    url: 'http://www.test.com',
  }
});
```

----------

#### stopDevEnvironment
停用开发者模式

##### `RNI.post('stopDevEnvironment')`


##### 例子
```
RNI.post('stopDevEnvironment');
```
