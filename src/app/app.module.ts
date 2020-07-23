import { PortalModule } from "@angular/cdk/portal";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { MatProgressBarModule, MatTabsModule } from "@angular/material";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { AuthModule } from "./auth/auth.module";
import { UserService } from "./users/users.service";
import { ElementComponent } from "./element/element.component";
import { FindComponent } from "./find/find.component";
import { PeriodicTableService } from "./periodic-table.service";
import { ProgressBarComponent } from "./progress-bar/progress-bar.component";
import { ScoreComponent } from "./score/score.component";
import { AuthGuard } from "./auth/auth.guard";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { ClipboardModule } from "@angular/cdk/clipboard";

const firebaseConfig = {
  apiKey: "AIzaSyAvbcQYPx6Ak_gBHZjXBg7VP3mXp2-m1KU",
  authDomain: "tigik-8d88c.firebaseapp.com",
  databaseURL: "https://tigik-8d88c.firebaseio.com",
  projectId: "tigik-8d88c",
  storageBucket: "tigik-8d88c.appspot.com",
  messagingSenderId: "977073675514",
  appId: "1:977073675514:web:49cbd33aee3e6056e07d43",
};

@NgModule({
  imports: [
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      {
        path: "",
        component: AppComponent,
      },
      {
        path: "test-trol",
        component: ScoreComponent,
        canActivate: [AuthGuard],
      },
    ]),
    HttpClientModule,
    MatProgressBarModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    ClipboardModule,
    AuthModule,
  ],
  declarations: [
    AppComponent,
    ElementComponent,
    ProgressBarComponent,
    ScoreComponent,
    FindComponent,
  ],
  providers: [PeriodicTableService, UserService, AuthGuard],
  bootstrap: [AppComponent],
  entryComponents: [FindComponent],
})
export class AppModule {}
