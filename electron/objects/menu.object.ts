import { Menu } from "electron";
import MenuItemConstructorOptions = Electron.MenuItemConstructorOptions;

export class MenuObject {
    obj: any;

    constructor(menuParams: MenuItemConstructorOptions[]) {
        this.obj = Menu.buildFromTemplate(menuParams);
    }
}