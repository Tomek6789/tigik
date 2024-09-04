import { Injectable } from "@angular/core";

const LEVELS = {
  One: ["H", "He", "Li", "B", "C", "N", "O", "F", "Ne", "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "K", "Ca", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn",  "Ag",  "Au", "Hg",  "Pb"],
  Two: ["Be", "Sc", "Ti", "V", "Ga", "Ge", "As", "Se", "Br", "Kr", "Rb", "Sr", "Y", "Zr", "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Cd", "In", "Sn", "Sb", "Te", "I", "Xe", "Cs", "Ba"],
  Three: ["Bi", "Po", "La", "Ce", "Pr", "Nd", "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb", "Lu", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Tl", "At", "Rn", "Fr", "Ra", "Ac", "Th", "Pa", "U", "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm", "Md", "No", "Lr"],
  Four: ["Rf", "Db", "Sg", "Bh", "Hs", "Mt", "Ds", "Rg", "Cn", "Nh", "Fl", "Mc", "Lv", "Ts", "Og"],
};

@Injectable({
  providedIn: "root",
})
export class LotteryService {
  public element = "Na";
  previousElement = null

  private table = [];
  drawElement(score: number) {
    this.updateTable(score);
    let newElement = this.getUniqueElement();
    this.previousElement = newElement;
    return newElement;
}

  private updateTable(score: number) {
    this.table = this.table.concat(LEVELS[this.currentLevel(score)]);
  }

  private getUniqueElement() {
    let element = this.findElement();
    while (this.previousElement === element) {
        element = this.findElement();
    }
    return element
  }

  public currentLevel(score: number): string {
    switch (true) {
      case score <= 60:
        return "One";
      case score <= 90:
        return "Two";
      case score <= 120:
        return "Three";
      case score <= 150:
        return "Four";
      default:
        return "One";
    }
  }

  public findElement(): string {
    const number = Math.floor(Math.random() * (this.table.length - 1)) + 1;
    return this.table[number];
  }
}
