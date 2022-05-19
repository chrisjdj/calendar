import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.scss']
})
export class MonthComponent implements OnInit {
  @Input() month;
  @Input() mName;
  @Output() dateSelected = new EventEmitter();

  public namesOfDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  constructor() { }

  ngOnInit() {
  }
  
  onDateSelected(day) {
    this.dateSelected.emit(day);
  }

  trackByFn(index, item) {
    // console.log('tb mon');  
    return index;
  }
}
