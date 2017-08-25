import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
declare var $: any;

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
    @ViewChild('masthead') masthead;
    @ViewChild('fixedMenu') fixedMenu;
    constructor() { }
    
    ngOnInit() {}
    ngAfterViewInit(){
    }
    
}
