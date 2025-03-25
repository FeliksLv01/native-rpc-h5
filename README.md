# @iwut/native-rpc-h5

掌上吾理 H5 NativeRPC SDK，用于调用 Native 能力

基础使用：

```ts
type AppInfo = {
	appId: string;
	appName: string;
	appVersion: string;
	systemVersion: string;
};

NativeRPC.call<AppInfo>('app.info').then((res) => {
	console.log(res.appVersion);
});

const response = await NativeRPC.call<AppInfo>('app.info');
console.log(response.appVersion);
```

客户端 SDK [NativeRPCServiceKit](https://github.com/FeliksLv01/NativeRPCServiceKit)
