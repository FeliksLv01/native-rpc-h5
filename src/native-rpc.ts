import EventEmitter from "./event-emitter";
import { NativeRPCRequest, NativeRPCResponse } from "./definitions";
import { win } from "./global";
import Env from "./env";

type NativeRPCParamValue =
  | string
  | number
  | boolean
  | null
  | NativeRPCParamValue[]
  | { [key: string]: NativeRPCParamValue };

interface StoredCallback {
  resolve?: (...args: any[]) => any;
  reject?: (...args: any[]) => any;
}

class NativeRPCStub {
  private callbacks: Map<string, StoredCallback>;
  private callbackIdCount: number;

  private emitter: EventEmitter;

  constructor() {
    this.callbacks = new Map();
    this.callbackIdCount = 0;
    this.emitter = new EventEmitter();
    win.rpcClient = this;
  }

  call<T>(rpcSignature: string, params?: Record<string, NativeRPCParamValue>) {
    const parts = rpcSignature.split(".");
    if (parts.length < 2) {
      throw new Error("error rpcSignature");
    }
    const method = parts.pop();
    const service = parts.join(".");

    if (!method) {
      throw new Error("error rpcSignature, no method");
    }

    return new Promise<T>((resolve, reject) => {
      const callbackId = String(this.callbackIdCount++);
      this.callbacks.set(callbackId, { resolve, reject });

      const request: NativeRPCRequest = {
        method,
        service,
        _meta: {
          callbackId,
        },
        params,
      };
      this.postMessageToNative(request);
    });
  }

  private postMessageToNative(message: any) {
    if (Env.isAndroid()) {
      win?.androidBridge?.postMessage(JSON.stringify(message));
    } else {
      win?.webkit?.messageHandlers?.bridge.postMessage(message);
    }
  }

  private onReceive(response: NativeRPCResponse) {
    if (response._meta.event) {
      this.emitter.emit(
        `${response.service}.${response._meta.event}`,
        response.data
      );
      return;
    }
    if (!response._meta.callbackId) {
      return;
    }
    const storedCall = this.callbacks.get(response._meta.callbackId);
    if (storedCall) {
      if (response.code !== 1000) {
        storedCall?.reject?.(
          new Error(
            response.message ?? `${JSON.stringify(response._meta)} call error`
          )
        );
      } else {
        storedCall?.resolve?.(response.data);
      }
      this.callbacks.delete(response._meta.callbackId);
    }
  }

  // 方法重载声明
  on(event: string, listener: (...args: any[]) => void): void;
  on(service: string, event: string, listener: (...args: any[]) => void): void;

  on(arg1: string, arg2: any, listener?: (...args: any[]) => void): void {
    let event: string | undefined;
    let service: string | undefined;
    if (typeof listener === "function") {
      this.emitter.on(`${arg1}.${arg2}`, listener);
      event = arg2;
      service = arg1;
    } else {
      const parts = arg1.split(".");
      if (parts.length < 2) {
        throw new Error("error eventSignature");
      }
      event = parts.pop();
      service = parts.join(".");
      this.emitter.on(arg1, arg2);
    }
    this.postMessageToNative({
      method: "_addEventListener",
      service: service,
      _meta: {
        event,
      },
    });
  }
}

const NativeRPC = new NativeRPCStub();

export default NativeRPC;
