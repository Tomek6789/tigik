import { Injectable } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
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

  openRoomsDialog() {
    this.dialogRef = this.dialog.open(RoomsDialogComponent, {
      width: "1200px",
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
