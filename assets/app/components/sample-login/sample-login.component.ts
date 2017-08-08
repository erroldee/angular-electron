import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {DataStore} from "../../shared/data/data-store.helper";
const { ipcRenderer } = electron;

@Component({
    selector: 'sample-login-component',
    styleUrls: ['sample-login.css'],
    templateUrl: 'sample-login.html'
})
export class SampleLoginComponent implements OnInit {
    testVar: string = "test";

    constructor(
        private _dataStore: DataStore,
        private _router: Router
    ) {
        if (this._dataStore.getToken()) {
            this.redirectToDashboard();
        }

        this.startElectronListener();
    }

    ngOnInit(): void {
        ipcRenderer.send("updater:start", "test");
    }

    startElectronListener() {
        ipcRenderer.on("updater:status", this.display.bind(this));
    }

    trigger() {
        ipcRenderer.send("trigger:test", "test");
    }

    display(event, data) {
        console.log(data);
        this.testVar = data;
    }

    login() {
        this._dataStore.setToken("token");
        this._router.navigate([this._dataStore.getRedirectURL()]);
    }

    redirectToDashboard() {
        this._router.navigate(["/dashboard"]);
    }
}