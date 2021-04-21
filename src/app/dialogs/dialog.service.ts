import { Injectable } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AuthService } from "app/auth/auth.service";
import { RoomsService } from "app/services/rooms.service";
import { UserService } from "app/services/users.service";
import { filter, take } from "rxjs/operators";
import { RoomsDialogComponent } from "./rooms-dialog/rooms-dialog.component";
import { WelcomeDialogComponent } from "./welcome-dialog/welcome-dialog.component";

@Injectable({
  providedIn: "root",
})
export class DialogService {
  private dialogRef: MatDialogRef<any, any>;

  constructor(public dialog: MatDialog) { }

  openWelcomDialog() {
    this.dialogRef = this.dialog.open(WelcomeDialogComponent, {
      width: "250px",
      disableClose: true,
    });
  }

  openRoomsDialog(data: any) {
    this.dialogRef = this.dialog.open(RoomsDialogComponent, {
      width: "1200px",
      data
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
