import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-day-counter',
    templateUrl: './day-counter.component.html',
    styleUrls: ['./day-counter.component.css']
})
export class DayCounterComponent implements OnInit {
    @Input() startDay;
    
    constructor() { }
    
    ngOnInit() {
    }

    checkDayCounter() {
        const today = new Date().getTime();
        if ( this.startDay - today > 0) {
            return true
        }
        return false
    }
    
}
