import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.css']
})
export class LandingComponent implements AfterViewInit {
    @ViewChild('masthead') masthead;
    @ViewChild('fixedMenu') fixedMenu;
    constructor() { }
    
    ngAfterViewInit() {
        
    }
    
}
