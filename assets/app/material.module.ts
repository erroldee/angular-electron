import {NgModule} from "@angular/core";
import {MdButtonModule, MdCardModule, MdToolbarModule} from "@angular/material";

@NgModule({
    imports: [
        MdToolbarModule,
        MdCardModule,
        MdButtonModule
    ],
    exports: [
        MdToolbarModule,
        MdCardModule,
        MdButtonModule
    ]
})

export class MaterialModule {}