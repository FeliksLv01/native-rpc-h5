import NativeRPCStub from "./native-rpc";

export interface HybridWindow {
  androidBridge?: {
    postMessage(data: string): void;
  };
  webkit?: {
    messageHandlers?: {
      bridge: {
        postMessage(data: any): void;
      };
    };
  };
  rpcClient?: typeof NativeRPCStub;
}

export const win = window as HybridWindow;
