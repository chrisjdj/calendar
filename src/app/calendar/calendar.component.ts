import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import * as moment from "moment";
import * as range from "lodash.range";

export interface CalendarDate {
  mDate: moment.Moment; // moment date object
  today?: boolean;  // is it today
  selected?: boolean; // is the date selected
  hidden?: boolean; // show the date be hidden in a month; hide next & prev months date from current month
  inactive?: boolean; // is the date before the today
  weekend?: boolean;  // is it weekend
  inbetween?: boolean;  // is the date between selected two dates
  columnInCalendar?: number; // column position in calendar (x axis)
  rowInCalendar?: number; // row position in calendar (y axis)
  id?: number; // month index
  fare?: string;  // fare to be shown in a day
  holiday?: string; // holiday to be shown in a day
}

@Component({
  selector: "lib-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"]
})
export class CalendarComponent implements OnInit {
  /**
   * setting verticalCalendar to TRUE opens full screen calendar to be used for Mobile devices
   */
  @Input() verticalCalendar: boolean = false;
  @Input() startDate = null;
  @Input() endDate = null;
  /**
   *  total number of months to be displayed
   */
  @Input() monthsLimit: number = 12;
  /**
   * headings to be displayed on top of the calendar
   */
  @Input() options = {
    firstOption: { text: 'Depart', selected: true },
    secondOption: { text: 'Return', selected: false },
    offerText: 'Book round trip for great savings',
    selectSingleDate: false,
    topHeading: 'Select Journey Date'
  };
  /**
   * event triggered when calendar closes
   */
  @Output() close = new EventEmitter();

  currentDate: moment.Moment;
  namesOfDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  weeks: Array<CalendarDate[]> = [];
  selectedDate;
  months = [];
  yymmAddedNumber = [];
  yymmAddedText = [];
  prevDate;
  startLimit: number = 0;
  endLimit: number = 0;
  selectedMonths = [];
  /**
   * format of holidays to be displayed on full screen (Mobile) calendar
   * 
   * syntax as follows
   * holidaysForVerticalCalendar = {
   *  month: [{date: date_as_string, holiday: holiday_string }]
   * }
   * 
   */
  holidaysForVerticalCalendar = {
    0: [
       {date:'00', holiday: "Holiday one" },
       {date:'07', holiday: "Holiday two" },
       {date:'15', holiday: "Holiday four" },
       {date:'18', holiday: "Holiday three" },
       {date:'20', holiday: "Holiday five" },
       {date:'23', holiday: "Holiday six" },
       {date:'27', holiday: "Holiday seven" },
    ],
    2: [
       {date:'00', holiday: "Holiday one" },
       {date:'07', holiday: "Holiday two" },
       {date:'15', holiday: "Holiday four" },
       {date:'18', holiday: "Holiday three" },
       {date:'20', holiday: "Holiday five" },
       {date:'23', holiday: "Holiday six" },
       {date:'27', holiday: "Holiday seven" },
    ],
    6: [
       {date:'00', holiday: "Holiday one" },
       {date:'07', holiday: "Holiday two" },
       {date:'15', holiday: "Holiday four" },
       {date:'18', holiday: "Holiday three" },
       {date:'20', holiday: "Holiday five" },
       {date:'23', holiday: "Holiday six" },
       {date:'27', holiday: "Holiday seven" },
    ],
    9: [
       {date:'00', holiday: "Holiday one" },
       {date:'07', holiday: "Holiday two" },
       {date:'15', holiday: "Holiday four" },
       {date:'18', holiday: "Holiday three" },
       {date:'20', holiday: "Holiday five" },
       {date:'23', holiday: "Holiday six" },
       {date:'27', holiday: "Holiday seven" },
    ],
    11: [
       {date:'00', holiday: "Holiday one" },
       {date:'07', holiday: "Holiday two" },
       {date:'15', holiday: "Holiday four" },
       {date:'18', holiday: "Holiday three" },
       {date:'20', holiday: "Holiday five" },
       {date:'23', holiday: "Holiday six" },
       {date:'27', holiday: "Holiday seven" },
    ],
  };

  constructor() {}

  ngOnInit() {
    this.currentDate = moment();
    this.selectedDate = moment(this.currentDate);
    this.prevDate = this.currentDate;
    this.generateCalendar();
    
    if(this.verticalCalendar) {
      for(let i = 0; i < this.monthsLimit; i++) {
        this.createNextMonths();
      }
      this.endLimit = this.monthsLimit + 1;
    } else {
      this.nextMonth();
      this.endLimit = this.startLimit + 2;
    }
  }

  showMonths() {
    console.log("yymmAddedNumber ", this.yymmAddedNumber);
    console.log("yymmAddedText ", this.yymmAddedText);
    console.log("months ", this.months);
  }

  addMonthsToList() {
    /**
     * adds a new month to the list of months
     */
    let date = moment(this.currentDate).format("YYYY-MM");

    if (!this.yymmAddedNumber.some((d) => d === date)) {
      if (this.currentDate > this.prevDate) {
        this.yymmAddedNumber.push(date);
        this.yymmAddedText.push(moment(date).format("MMMM YYYY"));
        this.months.push(this.weeks);
      } else {
        this.yymmAddedNumber.unshift(date);
        this.yymmAddedText.unshift(moment(date).format("MMMM YYYY"));
        this.months.unshift(this.weeks);
      }
    }
  }

  private generateCalendar(): void {
    const dates = this.fillDates(this.currentDate);

    const weeks = [];
    while (dates.length > 0) {
      weeks.push(dates.splice(0, 7));
    }
    this.weeks = weeks;

    this.addMonthsToList();
    this.prevDate = this.currentDate;
  }

  private fillDates(currentMoment: moment.Moment) {
    /**
     * create a month data
     */
    const firstOfMonth = moment(currentMoment).startOf("month").day();
    const lastOfMonth = moment(currentMoment).endOf("month").day();

    const firstDayOfGrid = moment(currentMoment)
      .startOf("month")
      .subtract(firstOfMonth, "days");
    const lastDayOfGrid = moment(currentMoment)
      .endOf("month")
      .subtract(lastOfMonth, "days")
      .add(7, "days");

    const startCalendar = firstDayOfGrid.date();

    return range(
      startCalendar,
      startCalendar + lastDayOfGrid.diff(firstDayOfGrid, "days")
    ).map((date) => {
      const newDate = moment(firstDayOfGrid).date(date);

      return {
        today: this.isToday(newDate),
        selected: false,
        mDate: newDate,
        hidden: this.isInCurrentMonth(newDate),
        inactive: this.isInactive(newDate),
        weekend: this.isWeekend(newDate),
        columnInCalendar: this.findDayInWeek(newDate),
        id: this.months.length,
        fare: '40.5K',
        holiday: 'Holidays to be shown here upon hovering'
      };
    });
  }

  public prevMonth(): void {
    /**
     * to show previous month if it exist, or creates a month before
     */
    if (
      moment(this.currentDate).format("MMMM YYYY") === this.yymmAddedText[1]
    ) {
      return;
    }

    this.currentDate = moment(this.currentDate).subtract(1, "months");
    this.generateCalendar();

    if (this.startLimit == 0) {
      this.endLimit = 2;
    } else {
      this.startLimit -= 1;
      this.endLimit -= 1;
    }
  }

  public nextMonth(): void {
    /**
     * to show next month if it exist, or creates a month ahead
     */
    if (this.endLimit == this.monthsLimit+1) {
      return;
    }

    this.currentDate = moment(this.currentDate).add(1, "months");
    this.generateCalendar();

    if (this.months.length == 2) {
      this.startLimit = 0;
      this.endLimit = 2;
      return;
    }

    this.startLimit += 1;
    this.endLimit += 1;
  }

  createNextMonths() {
    this.currentDate = moment(this.currentDate).add(1, "months");
    this.generateCalendar();
  }

  public isDisabledMonth(currentDate): boolean {
    const today = moment();
    return moment(currentDate).isBefore(today, "months");
  }

  private isToday(date: moment.Moment): boolean {
    return moment().isSame(moment(date), "day");
  }

  private isSelected(date: moment.Moment): boolean {
    return (
      moment(this.selectedDate).format("DD/MM/YYYY") ===
      moment(date).format("DD/MM/YYYY")
    );
  }

  private isInCurrentMonth(date: moment.Moment): boolean {
    return !moment(date).isSame(this.currentDate, "month");
  }

  private isInactive(date: moment.Moment): boolean {
    const today = moment().startOf("day");
    return (
      moment(date).isBefore(today) ||
      moment(date).isAfter(today.add(1, "years"))
    );
  }

  private isWeekend(date: moment.Moment) {
    return moment(date).day() % 6 == 0;
  }

  private findDayInWeek(date: moment.Moment) {
    return moment(date).day();
  }

  onDateSelected(day: CalendarDate) {
    /**
     * gets invoked when a date is clicked
     */
    if(this.options.selectSingleDate) {
      this.selectSingleDate(day);
      return;
    }

    let 
      currSelectedDate = moment(day.mDate),
      currentSelectedDateMMYY = currSelectedDate.format("MMMM YYYY"),
      currentSelectedDateMonthIndex = this.yymmAddedText.indexOf(currentSelectedDateMMYY),
      currSelectedWeekNo = currSelectedDate.weeks() - currSelectedDate.clone().startOf("month").weeks(),
      currSelected = this.months[currentSelectedDateMonthIndex][currSelectedWeekNo][day.columnInCalendar];
      currSelected.rowInCalendar = currSelectedWeekNo;
      
    if(!this.startDate) {
      currSelected.selected = true;
      this.startDate = currSelected;
      
      this.highlightSecondTab();
      return
    }

    if(this.startDate && !this.endDate && moment(currSelected.mDate).isBefore(moment(this.startDate.mDate))) {
      this.selectSingleDate(currSelected);
      this.highlightSecondTab();
      return
    }

    if(!this.endDate) {      
      this.endDate = currSelected;
      currSelected.selected = true;

      this.fillInBetweenDates();
      this.highlightFirstTab();
      return
    }
    
    if(this.startDate && this.endDate) {
      this.clearInBetweenDates();
      this.selectSingleDate(currSelected);
      this.highlightSecondTab();
      return
    }

    this.selectedDate = day.mDate;
  }

  private selectSingleDate(day: CalendarDate) {
    /**
     * gets invoked if the calendar is set to select only single dates
     */
    if(this.startDate) {
      let 
      prevSelectedDate = moment(this.startDate.mDate),
      prevSelectedDateMMYY = prevSelectedDate.format("MMMM YYYY"),
      prevSelectedDateMonthIndex = this.yymmAddedText.indexOf(prevSelectedDateMMYY),
      prevSelectedWeekNo = prevSelectedDate.weeks() - prevSelectedDate.clone().startOf("month").weeks(),
      prevSelected = this.months[prevSelectedDateMonthIndex][prevSelectedWeekNo][prevSelectedDate.day()];
      prevSelected.selected = false;
    }
    
    let  
    currSelectedDate = moment(day.mDate),
    currentSelectedDateMMYY = currSelectedDate.format("MMMM YYYY"),
    currentSelectedDateMonthIndex = this.yymmAddedText.indexOf(currentSelectedDateMMYY),
    currSelectedWeekNo = currSelectedDate.weeks() - currSelectedDate.clone().startOf("month").weeks(),
    currSelected = this.months[currentSelectedDateMonthIndex][currSelectedWeekNo][day.columnInCalendar];
    currSelected.rowInCalendar = currSelectedWeekNo;
    currSelected.selected = true;

    this.startDate = currSelected;
    return;
  }

  private fillInBetweenDates() {
    /**
     * used to fill colors for dates that are between 2 selected dates 
     */
    let 
      startMonth = this.startDate.id,
      endMonth =  this.endDate.id;
    this.selectedMonths = range(startMonth, endMonth + 1);
      
    // both dates are on the same Month
    if(moment(this.startDate.mDate).isSame(moment(this.endDate.mDate), 'month')) {
      let columnInCalendar, rowInCalendar;
          if(this.startDate.columnInCalendar <6) {
            columnInCalendar = this.startDate.columnInCalendar + 1;
            rowInCalendar = this.startDate.rowInCalendar;
          } else {
            columnInCalendar = 0;
            rowInCalendar = this.startDate.rowInCalendar + 1;
          }
          let endColumnInCalendar = 7;
        for(let monthRowLoop = rowInCalendar; monthRowLoop < this.endDate.rowInCalendar + 1; monthRowLoop++) {
          if(monthRowLoop === this.endDate.rowInCalendar) {
            endColumnInCalendar = this.endDate.columnInCalendar;
          }
          for(let monthColumnLoop = columnInCalendar; monthColumnLoop < endColumnInCalendar; monthColumnLoop++) {
            if(!this.months[startMonth][monthRowLoop][monthColumnLoop].hidden) {
              this.months[startMonth][monthRowLoop][monthColumnLoop].inbetween = true;
            }
          }
          columnInCalendar = 0;
        }
      return;
    }

    for(let monthOuterLoop = startMonth; monthOuterLoop < endMonth + 1; monthOuterLoop++) {
      if(monthOuterLoop === startMonth) {
        // to color the start Month
        let columnInCalendar, rowInCalendar;
        if(this.startDate.columnInCalendar <6) {
          columnInCalendar = this.startDate.columnInCalendar + 1;
          rowInCalendar = this.startDate.rowInCalendar;
        } else {
          columnInCalendar = 0;
          rowInCalendar = this.startDate.rowInCalendar + 1;
        }

        for(let monthRowLoop = rowInCalendar; monthRowLoop < this.months[monthOuterLoop].length; monthRowLoop++) {
          for(let monthColumnLoop = columnInCalendar; monthColumnLoop < this.months[monthOuterLoop][monthRowLoop].length; monthColumnLoop++) {
            if(!this.months[monthOuterLoop][monthRowLoop][monthColumnLoop].hidden) {
                this.months[monthOuterLoop][monthRowLoop][monthColumnLoop].inbetween = true;
            }
            columnInCalendar = 0;
          }
        }
      } else if(monthOuterLoop === endMonth) {
        // to color the end Month
        let columnInCalendar, rowInCalendar;
          rowInCalendar = this.endDate.rowInCalendar;
        
        for(let monthRowLoop = 0; monthRowLoop < rowInCalendar + 1; monthRowLoop++) {
          columnInCalendar = monthRowLoop === rowInCalendar ? this.endDate.columnInCalendar: this.months[monthOuterLoop][monthRowLoop].length;
          for(let monthColumnLoop = 0; monthColumnLoop < columnInCalendar; monthColumnLoop++) {
            if(!this.months[monthOuterLoop][monthRowLoop][monthColumnLoop].hidden) {
              this.months[monthOuterLoop][monthRowLoop][monthColumnLoop].inbetween = true;
            }
          }
        }
      } else {
        // to color dates in Months between start and end Months
        for(let monthRowLoop = 0; monthRowLoop < this.months[monthOuterLoop].length; monthRowLoop++) {
          for(let monthColumnLoop = 0; monthColumnLoop < this.months[monthOuterLoop][monthRowLoop].length; monthColumnLoop++) {
            if(!this.months[monthOuterLoop][monthRowLoop][monthColumnLoop].hidden) {
                this.months[monthOuterLoop][monthRowLoop][monthColumnLoop].inbetween = true;
            }
          }
        }
      }
    }
  }

  showOptionEndDate() {
    /**
     * used to highlight tabs on the top of the calendar
     */
    this.options.selectSingleDate = !this.options.selectSingleDate;
    if(this.options.selectSingleDate && this.startDate) {
      let startDate = this.startDate;
      this.clearInBetweenDates();
      this.selectSingleDate(startDate);
      this.highlightFirstTab();
    } else if(!this.options.selectSingleDate) {
      if(this.startDate) {
        this.highlightSecondTab();
      }
    }
  }

  private clearInBetweenDates() {
    /**
     * clear the colors of previously selected dates
     */
    if(this.selectedMonths.length === 1) {
      for(let monthRowLoop = 0; monthRowLoop < this.months[this.selectedMonths[0]].length; monthRowLoop++) {
        for(let monthColumnLoop = 0; monthColumnLoop < 7; monthColumnLoop++) {
          if(!this.months[this.selectedMonths[0]][monthRowLoop][monthColumnLoop].hidden) {
            this.months[this.selectedMonths[0]][monthRowLoop][monthColumnLoop].inbetween = false;
            this.months[this.selectedMonths[0]][monthRowLoop][monthColumnLoop].selected = false;
          }
        }
      }
      this.startDate = null;
      this.endDate = null;
      return
    }

    for(let monthOuterLoop = 0; monthOuterLoop < this.selectedMonths.length; monthOuterLoop++) {
      for(let monthRowLoop = 0; monthRowLoop < this.months[this.selectedMonths[monthOuterLoop]].length; monthRowLoop++) {
        for(let monthColumnLoop = 0; monthColumnLoop < 7; monthColumnLoop++) {
          if(!this.months[this.selectedMonths[monthOuterLoop]][monthRowLoop][monthColumnLoop].hidden) {
            this.months[this.selectedMonths[monthOuterLoop]][monthRowLoop][monthColumnLoop].inbetween = false;
            this.months[this.selectedMonths[monthOuterLoop]][monthRowLoop][monthColumnLoop].selected = false;
          }
        }
      }
    }
    this.startDate = null;
    this.endDate = null;
  }

  highlightFirstTab() {
    this.options.firstOption.selected = true;
    this.options.secondOption.selected = false;
  }

  highlightSecondTab() {
    if(!this.options.selectSingleDate) {
      this.options.firstOption.selected = false;
      this.options.secondOption.selected = true;
    }
  }

  trackByFn(index, item) {
    return index;
  }

  closeCalendar(returnValue: boolean = false) {
    /**
     * gets invoked when the calendar is closed
     */
    if(returnValue) {
      this.close.emit({startDate: this.startDate? moment(this.startDate.mDate).format(): null, endDate: this.endDate? moment(this.endDate.mDate).format(): null});
      return;
    }
    this.close.emit(null);
  }

  overlayClicked() {
    this.closeCalendar(true);    
  }
}
