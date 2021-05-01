import { ClipboardModule } from "@angular/cdk/clipboard";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";

import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { AuthGuard } from "./auth/auth.guard";
import { AuthModule } from "./auth/auth.module";
import { RoomsDialogComponent } from "./dialogs/rooms-dialog/rooms-dialog.component";
import { WelcomeDialogComponent } from "./dialogs/welcome-dialog/welcome-dialog.component";
import { PeriodicTableService } from "./services/periodic-table.service";
import { ProgressBarComponent } from "./components/progress-bar/progress-bar.component";
import { UserService } from "./services/users.service";
import { PeriodicTableComponent } from "./components/periodic-table/periodic-table.component";
import { MenuComponent } from "./components/menu/menu.component";
import { PlayerCardComponent } from './components/player-card/player-card.component';
import { MatSidenavModule } from '@angular/material/sidenav';

import { environment } from '../environments/environment';

@NgModule({
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig),
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
    ], { relativeLinkResolution: 'legacy' }),
    HttpClientModule,

    ReactiveFormsModule,
    MatProgressBarModule,
    MatCardModule,
    MatSidenavModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatIconModule,

    ClipboardModule,
    AuthModule,
  ],
  declarations: [
    AppComponent,
    ProgressBarComponent,

    WelcomeDialogComponent,
    RoomsDialogComponent,
    PeriodicTableComponent,
    MenuComponent,
    PlayerCardComponent,
  ],
  providers: [PeriodicTableService, UserService, AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule { }
