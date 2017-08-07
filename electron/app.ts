import {app} from "electron";
import {MainWindowModule} from "./modules/main-window.module";
import {CONSTANTS} from "./constants/constants";

class ElectronApp {
    constructor() {
        CONSTANTS.app = app;
        CONSTANTS.projectRoot = __dirname;
        CONSTANTS.app.on("ready", () => {
            CONSTANTS.windowMapping["main"] = CONSTANTS.windowList.length;
            CONSTANTS.windowList.push(new MainWindowModule());
        });
    }
}

new ElectronApp();