import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  showCalendar: boolean = false;
  verticalCalendar: boolean = false;

  openCalendar() {
    this.showCalendar = !this.showCalendar;
  }

  closeCalendar(event) {
    console.log(event);
    
    this.showCalendar = false;
  }
}
