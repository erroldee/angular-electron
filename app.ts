import {app, ipcMain} from "electron";
import {MainWindowModule} from "./electron/modules/main-window.module";
import {CONSTANTS} from "./electron/constants/constants";
const {autoUpdater} = require("electron-updater");
const log = require("electron-log");

class ElectronApp {
    constructor() {
        this.startLogger();
        this.startAutoUpdater();
        this.startApp();
    }

    startLogger(): void {
        autoUpdater.logger = log;
        autoUpdater.logger.transports.file.level = "info";
        log.info("App starting");
    }

    startAutoUpdater() {
        autoUpdater.on('checking-for-update', () => {
            this.sendStatusToWindow('Checking for update...');
        });

        autoUpdater.on('update-available', (info) => {
            this.sendStatusToWindow('Update available.');
        });

        autoUpdater.on('update-not-available', (info) => {
            this.sendStatusToWindow('Update not available.');
        });

        autoUpdater.on('error', (err) => {
            this.sendStatusToWindow('Error in auto-updater.');
        });

        autoUpdater.on('download-progress', (progressObj) => {
            let log_message = "Download speed: " + progressObj.bytesPerSecond;
            log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
            log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
            this.sendStatusToWindow(log_message);
        });

        autoUpdater.on('update-downloaded', (info) => {
            this.sendStatusToWindow('Update downloaded; will install in 5 seconds');
            // Wait 5 seconds, then quit and install
            // In your application, you don't need to wait 5 seconds.
            // You could call autoUpdater.quitAndInstall(); immediately
            setTimeout(function() {
                autoUpdater.quitAndInstall();
            }, 5000);
        });
    }

    startApp() {
        CONSTANTS.app = app;
        CONSTANTS.projectRoot = __dirname;
        this.appListener();
    }

    appListener() {
        CONSTANTS.app.on("ready", () => {
            CONSTANTS.windowMapping["main"] = CONSTANTS.windowList.length;
            CONSTANTS.windowList.push(new MainWindowModule());
        });

        CONSTANTS.app.on("window-all-closed", () => {
            CONSTANTS.app.quit();
        });

        ipcMain.on("updater:start", () => {
            try {
                autoUpdater.checkForUpdates();
            } catch (e) {
                console.log("Cannot run updater on local machine.");
            }

        });

        ipcMain.on("trigger:test", () => {
            console.log("triggered");
            this.sendStatusToWindow("testerz");
        });
    }

    sendStatusToWindow(text) {
        log.info(text);
        CONSTANTS.windowList[CONSTANTS.windowMapping["main"]].sendContent("updater:status", text);
    }
}

new ElectronApp();