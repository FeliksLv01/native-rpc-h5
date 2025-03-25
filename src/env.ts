import { HybridWindow } from "./global";

class Env {
  static getPlatformId = (): "Android" | "iOS" | "Web" => {
    const win = window as HybridWindow;
    if (win?.androidBridge) {
      return "Android";
    } else if (win?.webkit?.messageHandlers?.bridge) {
      return "iOS";
    } else {
      return "Web";
    }
  };

  static isAndroid = (): boolean => {
    const win = window as HybridWindow;
    if (win?.androidBridge) {
      return true;
    }
    return false;
  };

  static isiOS = (): boolean => {
    const win = window as HybridWindow;
    if (win?.webkit?.messageHandlers?.bridge) {
      return true;
    }
    return false;
  };
}

export default Env;
