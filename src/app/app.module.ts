import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { MatProgressBarModule, MatTabsModule } from "@angular/material";

import { AppComponent } from "./app.component";
import { ElementComponent } from "./element/element.component";
import { DatastorageService } from "./data-storage/datastorage.service";
import { PeriodicTableService } from "./periodic-table.service";
import { ProgressBarComponent } from "./progress-bar/progress-bar.component";
import { ScoreComponent } from "./score/score.component";
import { FindComponent } from "./find/find.component";
import { CommonModule } from "@angular/common";
import { PortalModule } from "@angular/cdk/portal";

@NgModule({
  declarations: [
    AppComponent,
    ElementComponent,
    ProgressBarComponent,
    ScoreComponent,
    FindComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatProgressBarModule,
    MatTabsModule,
    CommonModule,
    PortalModule
  ],
  providers: [PeriodicTableService, DatastorageService],
  bootstrap: [AppComponent],
  entryComponents: [FindComponent]
})
export class AppModule {}
