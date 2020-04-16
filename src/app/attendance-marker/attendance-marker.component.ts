import { Component, OnInit } from '@angular/core';
import { MilkAttendace, WaterCans } from './milkAttendance';
import { NgForm } from '@angular/forms';
import { AttendanceService } from './attendance.service';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-attendance-marker',
  templateUrl: './attendance-marker.component.html',
  styleUrls: ['./attendance-marker.component.css']
})
export class AttendanceMarkerComponent implements OnInit {

  inOrOut = false;
  waterInOrOut: boolean;
  MilkInOrOut: boolean;
  milkresponse = null;
  waterResponse = null;
  errorMilk = null;


  milkAttendance: MilkAttendace[] = [];
  waterAttendance: WaterCans[] = [];


  constructor(private attSer: AttendanceService, private authSer: AuthService) { }

  ngOnInit() {
  }

  addMilk(milkForm: NgForm, milkPrice: any) {
    const Liters: number = +milkForm.value.Liters;
    const MilkInOrOut: boolean = milkForm.value.MilkInOrOut;
    const MilkDate: Date = milkForm.value.MilkDate;
    const userEmail = this.authSer.userEmail;

    let RecievedOrNot = 'No';
    if (MilkInOrOut) { RecievedOrNot = 'Yes'; }

    const milkObj = new MilkAttendace(MilkDate, Liters, +milkPrice, userEmail);

    this.milkAttendance.push(milkObj);
    this.attSer.addMilk(milkObj).subscribe(data => {
       this.milkresponse = data;
       milkForm.resetForm();
    },
      error => { this.errorMilk = error.statusText; }
      );
    setTimeout(() => {
      this.milkresponse = null;
    }, 6000);
  }

  addWater(waterForm: NgForm, waterPrice: any) {
    const cans: number = +waterForm.value.waterCans;
    const waterInOrOut: boolean = waterForm.value.waterInOrOut;
    const waterDate: Date = waterForm.value.WaterDate;
    const userEmail = this.authSer.userEmail;

    let RecievedOrNot = 'No';
    if (waterInOrOut) { RecievedOrNot = 'Yes'; }

    const waterObj = new WaterCans(waterDate, cans, +waterPrice, userEmail);
    this.waterAttendance.push(waterObj);

    this.attSer.addWater(waterObj).subscribe(
      data => {this.waterResponse = data;
               waterForm.resetForm();
      },
      error => {this.errorMilk = error.statusText; }
    );
    setTimeout(() => {
      this.waterResponse = null;
    }, 6000);
  }

}
