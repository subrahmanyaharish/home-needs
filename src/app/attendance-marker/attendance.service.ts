import { Injectable } from '@angular/core';
import { MilkAttendace, WaterCans } from './milkAttendance';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { take, exhaustMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  milkAttendanceSer: MilkAttendace[] = [];
  waterAttendanceSer: WaterCans[] = [];
  urlMilk = 'https://home-needs-e7a96.firebaseio.com/milk.json';
  urlWater = 'https://home-needs-e7a96.firebaseio.com/water.json';


  constructor(private http: HttpClient, private authSer: AuthService) { }

  addMilk(milk: MilkAttendace) {
    this.milkAttendanceSer.push(milk);
    return this.http.post(this.urlMilk, milk);
  }

  addWater(water: WaterCans) {
    this.waterAttendanceSer.push(water);
    return this.http.post(this.urlWater, water);
  }

  getMilk() {
    return this.authSer.user.pipe(take(1), exhaustMap(user => {
      return this.http.get<MilkAttendace[]>(this.urlMilk);
    }));
  }

  getWater() {
    return this.authSer.user.pipe(take(1), exhaustMap(user => {
      return this.http.get<WaterCans[]>(this.urlWater);
    }));
  }

  updateMilk(milkBody: MilkAttendace[]) {
    this.http.put(this.urlMilk, milkBody).subscribe();
  }

  updateWater(waterBody: WaterCans[]) {
    this.http.put(this.urlWater, waterBody).subscribe();
  }
}
