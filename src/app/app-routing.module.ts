import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AttendanceMarkerComponent } from './attendance-marker/attendance-marker.component';
import { AttendanceEntriesComponent } from './attendance-marker/attendance-entries/attendance-entries.component';
import { SignInComponent } from './attendance-marker/sign-in/sign-in.component';
import { LoginComponent } from './attendance-marker/login/login.component';
import { HomeComponent } from './home/home.component';
import { WaterEntryComponent } from './water-entry/water-entry.component';
import { MilkEntryComponent } from './milk-entry/milk-entry.component';


const routes: Routes = [{path: '', component: HomeComponent, pathMatch: 'full'},
  {path: 'attendace', component: AttendanceMarkerComponent},
{path: 'attendace-entries', component: AttendanceEntriesComponent},
{path: 'signIn', component: SignInComponent},
{path: 'logIn', component: LoginComponent},
{path: 'water', component: WaterEntryComponent},
{path: 'milk', component: MilkEntryComponent}];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
