interface NativeRPCMeta {
	callbackId?: string;
	event?: string;
}

interface NativeRPCMessage {
	_meta: NativeRPCMeta;
	method: string;
	service: string;
}

export interface NativeRPCResponse extends NativeRPCMessage {
	data?: Record<string, any>;
	code: number;
	message?: string;
}

export interface NativeRPCRequest extends NativeRPCMessage {
	params?: Record<string, any>;
}
