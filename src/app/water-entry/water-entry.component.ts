import { Component, OnInit } from '@angular/core';
import { WaterCans } from '../attendance-marker/milkAttendance';
import { NgForm } from '@angular/forms';
import { AttendanceService } from '../attendance-marker/attendance.service';
import { AuthService } from '../attendance-marker/auth.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-water-entry',
  templateUrl: './water-entry.component.html',
  styleUrls: ['./water-entry.component.css']
})
export class WaterEntryComponent implements OnInit {

  allCansData: WaterCans[] = [];
  waterAttendanceSer: WaterCans[] = [];
  tempWaterAttendanceSer: WaterCans[] = [];
  waterFromToDate: WaterCans[] = [];
  resetWaterSer: WaterCans[] = [];

  totalWaterBill: number;
  waterSpin = false;
  editWaterProduct: WaterCans = {cans: 0, price: 20, waterIn: new Date(), user: null};
  errorMilk: string = null;
  errorWater: string = null;

  constructor(private attSer: AttendanceService, private authSer: AuthService) { }


  ngOnInit() {
    this.waterSpin = true;
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


  calculateTotalWaterPrice() {
    this.totalWaterBill = 0;
    this.waterAttendanceSer.forEach((value) => {
    this.totalWaterBill = (+value.price * +value.cans) + this.totalWaterBill;
    } );
  }

  editWater(prod: WaterCans) {
    this.editWaterProduct = JSON.parse(JSON.stringify(prod));
  }

  save() {
    const index = this.waterAttendanceSer.findIndex(
      element => {
        return element.id === this.editWaterProduct.id; });

    this.waterAttendanceSer[index].id = this.editWaterProduct.id;
    this.waterAttendanceSer[index].cans = +this.editWaterProduct.cans;
    this.waterAttendanceSer[index].waterIn = this.editWaterProduct.waterIn;
    this.waterAttendanceSer[index].price = this.editWaterProduct.price;

    const allIndex = this.allCansData.findIndex(
      element => {
        return element.id ===  this.waterAttendanceSer[index].id;
      }
    );
    this.allCansData[allIndex] = this.waterAttendanceSer[index];
    this.attSer.updateWater(this.allCansData);
    // this.attSer.updateWater(this.waterAttendanceSer);
  }

  resetWater() {
    this.waterAttendanceSer = [...this.resetWaterSer];
  }

  delete() {
      const index = this.waterAttendanceSer.findIndex(
        element => {
          return element.id === this.editWaterProduct.id;
        });
      const allIndex = this.allCansData.findIndex(
        element => {
          return element.id ===  this.editWaterProduct.id;
        }
      );
      this.waterAttendanceSer.splice(index, 1);
      this.allCansData.splice(allIndex, 1);
      this.attSer.updateWater(this.allCansData);
      // this.attSer.updateWater(this.waterAttendanceSer);
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

}
