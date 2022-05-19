import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-week',
  templateUrl: './week.component.html',
  styleUrls: ['./week.component.scss']
})
export class WeekComponent implements OnInit {
  @Input() week;
  @Output() dateSelected = new EventEmitter();
  
  constructor() { }

  ngOnInit() {
  }

  selectDate(day) {
    if(!day.hidden && !day.inactive) {
      this.dateSelected.emit(day);
    }
  }

  trackByFn(index, item) {
    // console.log('tb week');  
    return index;
  }
}
