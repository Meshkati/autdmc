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
        $(document)
        .ready(function() {
            // fix menu when passed
            $('.masthead')
            .visibility({
                once: false,
                onBottomPassed: function() {
                    console.log('khar')
                    $('.fixed.menu').transition('fade in');
                },
                onBottomPassedReverse: function() {
                    console.log('gav')
                    $('.fixed.menu').transition('fade out');
                }
            })
            ;
            // create sidebar and attach to menu open
            $('.ui.sidebar')
            .sidebar('attach events', '.toc.item')
            ;
        })
        ;
    }
    
}
