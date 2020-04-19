import { Component, OnInit } from '@angular/core';
import { MilkAttendace, WaterCans } from '../milkAttendance';
import { AttendanceService } from '../attendance.service';
import { map, findIndex } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-attendance-entries',
  templateUrl: './attendance-entries.component.html',
  styleUrls: ['./attendance-entries.component.css']
})
export class AttendanceEntriesComponent implements OnInit {

  milkAttendanceSer: MilkAttendace[] = [];
  tempMilkAttendanceSer: MilkAttendace[] = [];
  milkFromToDate: MilkAttendace[] = [];
  resetMilkSer: MilkAttendace[] = [];
  allMilkData: MilkAttendace[] = [];
  totalMilkBill: number;

  allCansData: WaterCans[] = [];
  waterAttendanceSer: WaterCans[] = [];
  tempWaterAttendanceSer: WaterCans[] = [];
  waterFromToDate: WaterCans[] = [];
  resetWaterSer: WaterCans[] = [];

  totalWaterBill: number;
  milkSpin = false;
  waterSpin = false;
  editMilkProd: MilkAttendace = null;
  editWaterProd: WaterCans = null;
  editMilkProduct: MilkAttendace = null;
  editWaterProduct: WaterCans = null;
  errorMilk: string = null;
  errorWater: string = null;


  constructor(private attSer: AttendanceService, private authSer: AuthService) { }

  ngOnInit() {
    this.milkSpin = true;
    this.waterSpin = true;
    this.attSer.getMilk().pipe(map(responseData => {
      const milkArray = [];
      // tslint:disable-next-line: forin
      for (const key in responseData) {
        milkArray.push({ ...responseData[key], id: key});
      }
      return milkArray;
    })).subscribe(
      data => {
                this.allMilkData = data;
                // this.milkAttendanceSer = data;
                // to filter data based on user
                this.milkAttendanceSer = this.allMilkData.filter(val => {
                  return val.user === this.authSer.userEmail;
                });
                //
                this.tempMilkAttendanceSer = [...this.milkAttendanceSer];
                this.resetMilkSer = [...this.milkAttendanceSer];
                this.milkSpin = false;
              },
      error => { this.errorMilk = error.statusText ; this.milkSpin = false; }
    );
    this.attSer.getWater().pipe(map(responseData => {
      const waterArray = [];
      // tslint:disable-next-line: forin
      for (const key in responseData) {
        waterArray.push({ ...responseData[key], id: key});
      }
      return waterArray;
    })).subscribe(
      data => {
                this.allCansData = data;
                // this.waterAttendanceSer = data;
                // to filter data based on user
                this.waterAttendanceSer = this.allCansData.filter(val => {
                  return val.user === this.authSer.userEmail;
                });
                //
                this.tempWaterAttendanceSer = this.waterAttendanceSer;
                this.resetWaterSer = [...this.waterAttendanceSer];
                this.waterSpin = false;
              },
      error => {this.errorWater = error.statusText; this.waterSpin = false; }
    );
  }

  calculateTotalMilkPrice() {
    this.totalMilkBill = 0;
    this.milkAttendanceSer.forEach((value) => {
    this.totalMilkBill = (+value.price * +value.litres) + this.totalMilkBill;
    } );
  }

  calculateTotalWaterPrice() {
    this.totalWaterBill = 0;
    this.waterAttendanceSer.forEach((value) => {
    this.totalWaterBill = (+value.price * +value.cans) + this.totalWaterBill;
    } );
  }

  editMilk(prod: MilkAttendace) {
    this.editMilkProd = JSON.parse(JSON.stringify(prod));
    this.editMilkProduct = JSON.parse(JSON.stringify(prod));
  }

  editWater(prod: WaterCans) {
    this.editWaterProd = JSON.parse(JSON.stringify(prod));
    this.editWaterProduct = JSON.parse(JSON.stringify(prod));
  }

  save() {
    if (this.editMilkProd) {
       const index = this.milkAttendanceSer.findIndex(
         element => {
           return element.id === this.editMilkProduct.id; });

       this.milkAttendanceSer[index].id = this.editMilkProduct.id;
       this.milkAttendanceSer[index].litres = this.editMilkProduct.litres;
       this.milkAttendanceSer[index].milkIn = this.editMilkProduct.milkIn;
       this.milkAttendanceSer[index].price = this.editMilkProduct.price;

       const allIndex = this.allMilkData.findIndex(
        element => {
          return element.id ===  this.milkAttendanceSer[index].id;
        }
      );

       this.allMilkData[allIndex] = this.milkAttendanceSer[index];
       this.attSer.updateMilk(this.allMilkData);

       this.editMilkProd = null;
       }
    if (this.editWaterProd) {
      const index = this.waterAttendanceSer.findIndex(
        element => {
          return element.id === this.editWaterProd.id; });

      this.waterAttendanceSer[index].id = this.editWaterProd.id;
      this.waterAttendanceSer[index].cans = this.editWaterProd.cans;
      this.waterAttendanceSer[index].waterIn = this.editWaterProd.waterIn;
      this.waterAttendanceSer[index].price = this.editWaterProd.price;

      const allIndex = this.allCansData.findIndex(
        element => {
          return element.id ===  this.waterAttendanceSer[index].id;
        }
      );
      this.allCansData[allIndex] = this.waterAttendanceSer[index];
      this.attSer.updateWater(this.allCansData);
      this.editWaterProd = null;
    }
  }

  delete() {
    if (this.editMilkProd) {
      const index = this.milkAttendanceSer.findIndex(
        element => {
          return element.id === this.editMilkProduct.id; });
      const allIndex = this.allMilkData.findIndex(
            element => {
              return element.id ===  this.editMilkProduct.id;
            }
          );
      this.milkAttendanceSer.splice(index, 1);
      this.allMilkData.splice(allIndex, 1);
      this.attSer.updateMilk(this.allMilkData);
      this.editMilkProd = null;
    }
    if (this.editWaterProd) {
      const index = this.waterAttendanceSer.findIndex(
        element => {
          return element.id === this.editWaterProd.id; });
      const allIndex = this.allCansData.findIndex(
            element => {
              return element.id ===  this.editWaterProduct.id;
            }
          );
      this.waterAttendanceSer.splice(index, 1);
      this.allCansData.splice(allIndex, 1);
      this.attSer.updateWater(this.allCansData);
      this.editWaterProd = null;
    }
  }


  fromToDate(dateForm: NgForm) {
    this.milkAttendanceSer = this.tempMilkAttendanceSer;
    this.milkFromToDate = this.milkAttendanceSer.filter(value => {
      const milkFromDate = new Date(value.milkIn);
      const milkToDate = new Date(value.milkIn);
      return (milkFromDate >=  dateForm.value.fromDate && milkToDate  <= dateForm.value.toDate);
    });
    this.milkAttendanceSer = this.milkFromToDate;
    dateForm.resetForm();
  }

  WaterfromToDate(WaterdateForm: NgForm) {
    this.waterAttendanceSer = this.tempWaterAttendanceSer;
    this.waterFromToDate = this.waterAttendanceSer.filter(value => {
      const milkFromDate = new Date(value.waterIn);
      const milkToDate = new Date(value.waterIn);
      return (milkFromDate >=  WaterdateForm.value.WaterfromDate && milkToDate  <= WaterdateForm.value.WatertoDate);
    });
    this.waterAttendanceSer = this.waterFromToDate;
    WaterdateForm.resetForm();
  }

  resetWater() {
    this.waterAttendanceSer = [...this.resetWaterSer];
  }

  resetMilk() {
    this.milkAttendanceSer = [...this.resetMilkSer];
  }

}
