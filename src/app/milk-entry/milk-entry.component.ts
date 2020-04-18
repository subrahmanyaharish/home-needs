import { Component, OnInit } from '@angular/core';
import { MilkAttendace, WaterCans } from '../attendance-marker/milkAttendance';
import { AttendanceService } from '../attendance-marker/attendance.service';
import { AuthService } from '../attendance-marker/auth.service';
import { map } from 'rxjs/operators';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-milk-entry',
  templateUrl: './milk-entry.component.html',
  styleUrls: ['./milk-entry.component.css']
})
export class MilkEntryComponent implements OnInit {

  milkAttendanceSer: MilkAttendace[] = [];
  tempMilkAttendanceSer: MilkAttendace[] = [];
  milkFromToDate: MilkAttendace[] = [];
  resetMilkSer: MilkAttendace[] = [];
  totalMilkBill: number;

  milkSpin = false;
  editMilkProduct: MilkAttendace = {litres: 0, price: 40, milkIn: new Date(), user: null};
  errorMilk: string = null;


  constructor(private attSer: AttendanceService, private authSer: AuthService) { }

  ngOnInit() {
    this.milkSpin = true;
    this.attSer.getMilk().pipe(map(responseData => {
      const milkArray = [];
      // tslint:disable-next-line: forin
      for (const key in responseData) {
        milkArray.push({ ...responseData[key], id: key});
      }
      return milkArray;
    })).subscribe(
      data => {
                this.milkAttendanceSer = data;
                // to filter data based on user
                this.milkAttendanceSer = this.milkAttendanceSer.filter(val => {
                  return val.user === this.authSer.userEmail;
                });
                //
                this.tempMilkAttendanceSer = this.milkAttendanceSer;
                this.resetMilkSer = [...this.milkAttendanceSer];
                this.milkSpin = false;
              },
      error => { this.errorMilk = error.statusText ; this.milkSpin = false; }
    );
  }

  calculateTotalMilkPrice() {
    this.totalMilkBill = 0;
    this.milkAttendanceSer.forEach((value) => {
    this.totalMilkBill = (+value.price * +value.litres) + this.totalMilkBill;
    } );
  }


  editMilk(prod: MilkAttendace) {
    this.editMilkProduct = JSON.parse(JSON.stringify(prod));
  }


  save() {
      const index = this.milkAttendanceSer.findIndex(element => {return element.id === this.editMilkProduct.id; });
      this.milkAttendanceSer[index].id = this.editMilkProduct.id;
      this.milkAttendanceSer[index].litres = this.editMilkProduct.litres;
      this.milkAttendanceSer[index].milkIn = this.editMilkProduct.milkIn;
      this.milkAttendanceSer[index].price = this.editMilkProduct.price;
      this.attSer.updateMilk(this.milkAttendanceSer);
  }

  delete() {
      const index = this.milkAttendanceSer.findIndex(element => {return element.id === this.editMilkProduct.id; });
      this.milkAttendanceSer.splice(index, 1);
      this.attSer.updateMilk(this.milkAttendanceSer);
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

  resetMilk() {
    this.milkAttendanceSer = [...this.resetMilkSer];
  }

}
