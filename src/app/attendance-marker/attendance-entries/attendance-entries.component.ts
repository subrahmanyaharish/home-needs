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
    this.editMilkProduct = JSON.parse(JSON.stringify(prod));
  }

  editWater(prod: WaterCans) {
    this.editWaterProduct = JSON.parse(JSON.stringify(prod));
  }

  save() {
    if (this.editMilkProduct) {
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

       this.editMilkProduct = null;
       }
    if (this.editWaterProduct) {
      const index = this.waterAttendanceSer.findIndex(
        element => {
          return element.id === this.editWaterProduct.id; });

      this.waterAttendanceSer[index].id = this.editWaterProduct.id;
      this.waterAttendanceSer[index].cans = this.editWaterProduct.cans;
      this.waterAttendanceSer[index].waterIn = this.editWaterProduct.waterIn;
      this.waterAttendanceSer[index].price = this.editWaterProduct.price;

      const allIndex = this.allCansData.findIndex(
        element => {
          return element.id ===  this.waterAttendanceSer[index].id;
        }
      );
      this.allCansData[allIndex] = this.waterAttendanceSer[index];
      this.attSer.updateWater(this.allCansData);
      this.editWaterProduct = null;
    }
  }

  delete() {
    if (this.editMilkProduct) {
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
      this.editMilkProduct = null;
    }
    if (this.editWaterProduct) {
      const index = this.waterAttendanceSer.findIndex(
        element => {
          return element.id === this.editWaterProduct.id; });
      const allIndex = this.allCansData.findIndex(
            element => {
              return element.id ===  this.editWaterProduct.id;
            }
          );
      this.waterAttendanceSer.splice(index, 1);
      this.allCansData.splice(allIndex, 1);
      this.attSer.updateWater(this.allCansData);
      this.editWaterProduct = null;
    }
  }


  fromToDate(dateForm: NgForm) {
    this.milkAttendanceSer = this.tempMilkAttendanceSer;
    this.milkFromToDate = this.milkAttendanceSer.filter(value => {
      const milkFromDate = new Date(value.milkIn);
      milkFromDate.setHours(0, 0, 0);
      return (milkFromDate >=  dateForm.value.fromDate && milkFromDate  <= dateForm.value.toDate);
    });
    this.milkAttendanceSer = this.milkFromToDate;
    this.calculateTotalMilkPrice();
    dateForm.resetForm();
  }

  WaterfromToDate(WaterdateForm: NgForm) {
    this.waterAttendanceSer = this.tempWaterAttendanceSer;
    this.waterFromToDate = this.waterAttendanceSer.filter(value => {
      const milkFromDate = new Date(value.waterIn);
      milkFromDate.setHours(0, 0, 0);
      return (milkFromDate >=  WaterdateForm.value.WaterfromDate && milkFromDate  <= WaterdateForm.value.WatertoDate);
    });
    this.waterAttendanceSer = this.waterFromToDate;
    this.calculateTotalWaterPrice();
    WaterdateForm.resetForm();
  }

  resetWater() {
    this.waterAttendanceSer = [...this.resetWaterSer];
    this.calculateTotalWaterPrice();
  }

  resetMilk() {
    this.milkAttendanceSer = [...this.resetMilkSer];
    this.calculateTotalMilkPrice();
  }

}
