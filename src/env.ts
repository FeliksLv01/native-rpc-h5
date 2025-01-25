import { HybridWindow } from './global';

class Env {
	static getPlatformId = (): 'Android' | 'iOS' | 'Web' => {
		const win = window as HybridWindow;
		if (win?.androidBridge) {
			return 'Android';
		} else if (win?.webkit?.messageHandlers?.bridge) {
			return 'iOS';
		} else {
			return 'Web';
		}
	};
}

export default Env;
