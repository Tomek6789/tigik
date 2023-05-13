import { Injectable } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { RoomsDialogComponent } from "./rooms-dialog/rooms-dialog.component";

@Injectable({
  providedIn: "root",
})
export class DialogService {
  private dialogRef: MatDialogRef<any, any>;

  constructor(public dialog: MatDialog) { }

  openRoomsDialog() {
    this.dialogRef = this.dialog.open(RoomsDialogComponent, {
      width: "1200px",
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
