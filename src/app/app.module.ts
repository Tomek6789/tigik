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
import {MatTooltipModule} from '@angular/material/tooltip';


import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { AuthGuard } from "./auth/auth.guard";
import { AuthModule } from "./auth/auth.module";
import { RoomsDialogComponent } from "./dialogs/rooms-dialog/rooms-dialog.component";
import { PeriodicTableService } from "./services/periodic-table.service";
import { ProgressBarComponent } from "./components/progress-bar/progress-bar.component";
import { UserService } from "./services/users.service";
import { PeriodicTableComponent } from "./components/periodic-table/periodic-table.component";
import { MenuComponent } from "./components/menu/menu.component";
import { MatSidenavModule } from '@angular/material/sidenav';

import { environment } from '../environments/environment';
import { ProfileComponent } from "./components/profile/profile.component";

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
    MatTooltipModule,

    ClipboardModule,
    AuthModule,
  ],
  declarations: [
    AppComponent,
    ProgressBarComponent,

    ProfileComponent,
    RoomsDialogComponent,
    PeriodicTableComponent,
    MenuComponent,
  ],
  providers: [PeriodicTableService, UserService, AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule { }
