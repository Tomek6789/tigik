import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-welcome-dialog",
  templateUrl: "./welcome-dialog.component.html",
  styleUrls: ["./welcome-dialog.component.css"],
})
export class WelcomeDialogComponent {
  displayName = new FormControl("Visitor");

  constructor(
    public dialogRef: MatDialogRef<WelcomeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}
