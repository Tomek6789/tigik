import { ClipboardModule } from "@angular/cdk/clipboard";
import { HttpClientModule } from "@angular/common/http";
import { NgModule, isDevMode } from "@angular/core";
// import { AngularFireModule,  } from "@angular/fire";
// import { AngularFireAuthModule } from "@angular/fire/auth";
// import { AngularFireDatabaseModule } from "@angular/fire/database";
// import { AngularFirestoreModule } from "@angular/fire/firestore";

import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

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
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducerUser, userFeatureKey, UserState } from "./store/user/user.reducer";
import { reducerRoom, roomFeatureKey, RoomState } from "./store/room/room.reducer";
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { provideDatabase } from "@angular/fire/database";
import { getDatabase } from "@firebase/database";
import { provideAuth } from "@angular/fire/auth";
import { getAuth } from "@firebase/auth";
import { UserEffects } from "./store/user/user.effects";
import { RoomEffects } from "./store/room/room.effects";

export interface AppState {
  [userFeatureKey]: UserState,
  [roomFeatureKey]: RoomState
}

@NgModule({
  imports: [
    // AngularFireModule.initializeApp(environment.firebaseConfig),
    // AngularFirestoreModule,
    // AngularFireAuthModule,
    // AngularFireDatabaseModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    provideAuth(() => getAuth()),

    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      {
        path: "",
        component: AppComponent,
      },
    ]),
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
    StoreModule.forRoot({
      [userFeatureKey]: reducerUser,
      [roomFeatureKey]: reducerRoom
    }, {}),
    EffectsModule.forRoot([UserEffects, RoomEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),

  ],
  declarations: [
    AppComponent,
    ProgressBarComponent,

    ProfileComponent,
    RoomsDialogComponent,
    PeriodicTableComponent,
    MenuComponent,
  ],
  providers: [PeriodicTableService, UserService],
  bootstrap: [AppComponent],
})
export class AppModule { }
