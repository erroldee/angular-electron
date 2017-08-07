import { BrowserWindow } from "electron";
import BrowserWindowConstructorOptions = Electron.BrowserWindowConstructorOptions;
import Menu = Electron.Menu;

export class WindowObject {
    obj: any;

    constructor(windowParams: BrowserWindowConstructorOptions) {
        this.obj = new BrowserWindow(windowParams);
    }

    loadURL(loadURL: string) {
        this.obj.loadURL(loadURL);
    }

    setMenu(menu: Menu) {
        this.obj.setMenu(menu);
    }

    addListener(eventName: string, handler: any) {
        this.obj.on(eventName, handler);
    }

    removeListener(eventName: string, handler: any) {
        this.obj.removeListener(eventName, handler);
    }
}