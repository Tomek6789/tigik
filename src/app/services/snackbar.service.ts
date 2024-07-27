import { MatSnackBar } from "@angular/material/snack-bar";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class SnackBarService {
  constructor(private _snackBar: MatSnackBar) {}

  openSnackBar(message: string) {
    this._snackBar.open(message, null, {
      duration: 3000,
    });
  }
}
