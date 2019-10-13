import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule }    from '@angular/http';
import { MdProgressBarModule, MatTabsModule } from '@angular/material'

import { AppComponent } from './app.component';
import { ElementComponent } from './element/element.component';
import { DatastorageService } from './data-storage/datastorage.service';
import { PeriodicTableService } from './periodic-table.service';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { ScoreComponent } from './score/score.component';
import { FindComponent } from './find/find.component';
import { IntroduceComponent } from './introduce/introduce.component';

@NgModule({
  declarations: [
    AppComponent,
    ElementComponent,
    ProgressBarComponent,
    ScoreComponent,
    FindComponent,
    IntroduceComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    MdProgressBarModule,
    MatTabsModule,
  ],
  providers: [
    PeriodicTableService,
    DatastorageService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
