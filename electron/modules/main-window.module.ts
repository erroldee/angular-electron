import { app } from "electron";
import {WindowObject} from "../objects/window.object";
import {MenuObject} from "../objects/menu.object";
import MenuItemConstructorOptions = Electron.MenuItemConstructorOptions;
import {CONSTANTS} from "../constants/constants";
const url = require('url');
const path = require('path');

export class MainWindowModule {
    private mainWindow: WindowObject;
    private mainMenu: MenuObject;
    private menu: MenuItemConstructorOptions[];
    private mainHTML: string = CONSTANTS.mainDevHTML;

    constructor() {
        this.appEvents();
    }

    appEvents() {
        this.mainWindow = new WindowObject({});
        this.loadMain();
        this.loadEvents();
        this.buildMenu();
    }

    loadMain() {
        if (CONSTANTS.production) {
            this.mainHTML = url.format({
                pathname: path.join(CONSTANTS.projectRoot, `/${CONSTANTS.mainProdHTML}`),
                protocol: 'file:',
                slashes: true
            });
        }
        this.mainWindow.loadURL(this.mainHTML);
    }

    loadEvents() {
        this.mainWindow.addListener("closed", () => {
            CONSTANTS.windowList[CONSTANTS.windowMapping["main"]] = null;
        });
    }

    buildMenu() {
        this.menu = [
            {
                label: "File",
                submenu: [
                    {
                        label: "Quit",
                        accelerator: process.platform === "darwin" ? "Command + Q" : "Ctrl + Q",
                        click() {
                            CONSTANTS.windowList[CONSTANTS.windowMapping['main']].closeWindow();
                        }
                    }
                ]
            }
        ];

        if (CONSTANTS.production) {
            const inspector: any = {
                label: "Debug",
                submenu: [
                    {
                        role: "reload"
                    },
                    {
                        label: "Inspect",
                        accelerator: process.platform === "darwin" ? "Command + Alt + I" : "Ctrl + Shift + I",
                        click(item: any, focusedWindow: any) {
                            focusedWindow.toggleDevTools();
                        }
                    }
                ]
            };

            this.menu.push(inspector);
        }

        if (process.platform === "darwin") {
            this.menu.unshift({});
        }

        this.mainMenu = new MenuObject(this.menu);
        this.mainWindow.setMenu(this.mainMenu.obj);
    }

    sendContent(channel: string, data: any) {
        this.mainWindow.obj.webContents.send(channel, data);
    }

    closeWindow() {
        this.mainWindow.obj.close();
    }
}