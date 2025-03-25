// 事件监听器类型定义
type Listener = (...args: any[]) => void;

// 事件监听器接口
interface EventListener {
	fn: Listener;
	once: boolean;
}

export default class EventEmitter {
	// 存储事件和对应的监听器
	private events: Map<string, EventListener[]>;

	constructor() {
		this.events = new Map();
	}

	/**
	 * 添加事件监听器
	 * @param event 事件名称
	 * @param fn 监听器函数
	 * @param once 是否只监听一次
	 */
	private _addListener(event: string, fn: Listener, once: boolean): this {
		const listeners = this.events.get(event) || [];
		listeners.push({ fn, once });
		this.events.set(event, listeners);
		return this;
	}

	/**
	 * 添加事件监听器
	 * @param event 事件名称
	 * @param fn 监听器函数
	 */
	on(event: string, fn: Listener): this {
		return this._addListener(event, fn, false);
	}

	/**
	 * 添加一次性事件监听器
	 * @param event 事件名称
	 * @param fn 监听器函数
	 */
	once(event: string, fn: Listener): this {
		return this._addListener(event, fn, true);
	}

	/**
	 * 移除事件监听器
	 * @param event 事件名称
	 * @param fn 监听器函数
	 */
	off(event: string, fn?: Listener): this {
		if (!fn) {
			// 如果没有提供具体的监听器函数，则移除该事件的所有监听器
			this.events.delete(event);
			return this;
		}

		const listeners = this.events.get(event);
		if (!listeners) return this;

		// 过滤掉要移除的监听器
		const filteredListeners = listeners.filter((listener) => listener.fn !== fn);

		if (filteredListeners.length === 0) {
			this.events.delete(event);
		} else {
			this.events.set(event, filteredListeners);
		}

		return this;
	}

	/**
	 * 触发事件
	 * @param event 事件名称
	 * @param args 传递给监听器的参数
	 */
	emit(event: string, ...args: any[]): boolean {
		const listeners = this.events.get(event);
		if (!listeners) return false;

		// 创建一个新数组来存储需要保留的监听器
		const remainingListeners: EventListener[] = [];

		for (const listener of listeners) {
			listener.fn.apply(this, args);

			// 如果不是一次性监听器，则保留
			if (!listener.once) {
				remainingListeners.push(listener);
			}
		}

		// 更新事件监听器列表
		if (remainingListeners.length === 0) {
			this.events.delete(event);
		} else {
			this.events.set(event, remainingListeners);
		}

		return true;
	}

	/**
	 * 获取指定事件的监听器数量
	 * @param event 事件名称
	 */
	listenerCount(event: string): number {
		const listeners = this.events.get(event);
		return listeners ? listeners.length : 0;
	}

	/**
	 * 移除所有事件监听器
	 */
	removeAllListeners(): this {
		this.events.clear();
		return this;
	}
}
