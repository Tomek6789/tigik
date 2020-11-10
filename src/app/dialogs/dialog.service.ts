import { Injectable } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { WelcomeDialogComponent } from "./welcome-dialog/welcome-dialog.component";
import { RoomsDialogComponent } from "./rooms-dialog/rooms-dialog.component";
import { Room } from "app/services/rooms.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DialogService {
  constructor(public dialog: MatDialog) {}

  openWelcomDialog(): MatDialogRef<WelcomeDialogComponent, any> {
    return this.dialog.open(WelcomeDialogComponent, {
      width: "250px",
      disableClose: true,
    });
  }

  openRoomsDialog(
    rooms: Observable<Room[]>
  ): MatDialogRef<RoomsDialogComponent, any> {
    return this.dialog.open(RoomsDialogComponent, {
      width: "1200px",
      data: {
        rooms,
      },
    });
  }
}
