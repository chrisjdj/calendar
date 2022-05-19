import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { WeekComponent } from './week/week.component';
import { MonthComponent } from './month/month.component';
import { CalendarComponent } from './calendar/calendar.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    WeekComponent,
    MonthComponent,
    CalendarComponent
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    MatIconModule,
    MatButtonModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
