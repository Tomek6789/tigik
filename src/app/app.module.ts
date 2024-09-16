import { ClipboardModule } from "@angular/cdk/clipboard";
import { HttpClientModule } from "@angular/common/http";
import { NgModule, isDevMode } from "@angular/core";
import { provideFirebaseApp, getApp, initializeApp } from "@angular/fire/app";
import { getFirestore, provideFirestore } from "@angular/fire/firestore";

import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";

import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { BrowserModule } from "@angular/platform-browser";
import { MatRippleModule } from "@angular/material/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { AuthModule } from "./auth/auth.module";
import { PeriodicTableService } from "./services/periodic-table.service";
import { ProgressBarComponent } from "./components/progress-bar/progress-bar.component";
import { UserService } from "./services/users.service";
import { PeriodicTableComponent } from "./components/periodic-table/periodic-table.component";
import { MenuComponent } from "./components/menu/menu.component";
import { MatSidenavModule } from "@angular/material/sidenav";

import { environment } from "../environments/environment";
import { ProfileComponent } from "./components/profile/profile.component";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import UserState, {
  reducerUser,
  usersFeatureKey,
} from "./store/user/user.reducer";
import {
  reducerRoom,
  roomFeatureKey,
  RoomState,
} from "./store/room/room.reducer";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import {
  connectDatabaseEmulator,
  provideDatabase,
} from "@angular/fire/database";
import { getDatabase } from "@firebase/database";
import { provideAuth } from "@angular/fire/auth";
import { connectAuthEmulator, getAuth } from "@firebase/auth";
import { UserEffects } from "./store/user/user.effects";
import { RoomEffects } from "./store/room/room.effects";
import { getFunctions, provideFunctions } from "@angular/fire/functions";
import { connectFunctionsEmulator } from "@firebase/functions";

export interface AppState {
  [usersFeatureKey]: UserState;
  [roomFeatureKey]: RoomState;
}

@NgModule({
  imports: [
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => {
      const database = getDatabase();
      // connectDatabaseEmulator(database, "localhost", 9000);
      return database;
    }),
    provideAuth(() => {
      const auth = getAuth();
      // connectAuthEmulator(auth, "http://127.0.0.1:9099");
      return auth;
    }),
    provideFunctions(() => {
      const functions = getFunctions(getApp());
      // connectFunctionsEmulator(functions, "127.0.0.1", 5001);
      return functions;
    }),

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
    MatRippleModule,

    ClipboardModule,
    AuthModule,
    StoreModule.forRoot(
      {
        [usersFeatureKey]: reducerUser,
        [roomFeatureKey]: reducerRoom,
      },
      {}
    ),
    EffectsModule.forRoot([UserEffects, RoomEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
  ],
  declarations: [
    AppComponent,
    ProgressBarComponent,

    ProfileComponent,

    PeriodicTableComponent,
    MenuComponent,
  ],
  providers: [PeriodicTableService, UserService],
  bootstrap: [AppComponent],
})
export class AppModule {}
