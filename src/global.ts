import NativeRPCStub from './native-rpc';

export interface HybridWindow {
	androidBridge?: {
		postMessage(data: string): void;
		onmessage?: (event: { data: string }) => void;
	};
	webkit?: {
		messageHandlers?: {
			bridge: {
				postMessage(data: any): void;
			};
		};
	};
	rpcClient?: NativeRPCStub;
}

export const win = window as HybridWindow;
