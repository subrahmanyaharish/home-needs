import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatProgressBarModule, MatInputModule, MatTooltipModule, MatTabsModule, MatCheckboxModule } from '@angular/material';
import { MatCardModule, MatDividerModule, MatButtonModule, MatExpansionModule, MatNativeDateModule } from '@angular/material';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDatepickerModule} from '@angular/material/datepicker';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AttendanceMarkerComponent } from './attendance-marker/attendance-marker.component';
import { AttendanceEntriesComponent } from './attendance-marker/attendance-entries/attendance-entries.component';
import { SignInComponent } from './attendance-marker/sign-in/sign-in.component';
import { LoginComponent } from './attendance-marker/login/login.component';
import { AuthInterceptorService } from './attendance-marker/auth.intercetor';
import { AttendanceService } from './attendance-marker/attendance.service';

@NgModule({
  declarations: [
    AppComponent,
    AttendanceMarkerComponent,
    AttendanceEntriesComponent,
    SignInComponent,
    LoginComponent  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatExpansionModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividerModule,
    MatCheckboxModule,
    MatTabsModule,
    MatProgressBarModule
  ],
  providers: [AttendanceService,
              {
                provide: HTTP_INTERCEPTORS,
                useClass: AuthInterceptorService,
                multi: true
              }
            ],
  bootstrap: [AppComponent]
})
export class AppModule { }
