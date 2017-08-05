import { Component, OnInit } from '@angular/core';
import {trigger, animate, style, group, animateChild, query, stagger, transition} from '@angular/animations';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    animations: [
        trigger('routerTransition', [
            transition('* <=> *', [
                /* order */
                /* 1 */ query(':enter, :leave', style({ position: 'fixed', width:'100%' })
                , { optional: true }),
                /* 2 */ group([  // block executes in parallel
                    query(':enter', [
                        style({ transform: 'translateX(100%)' }),
                        animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))
                    ], { optional: true }),
                    query(':leave', [
                        style({ transform: 'translateX(0%)' }),
                        animate('0.5s ease-in-out', style({ transform: 'translateX(-100%)' }))
                    ], { optional: true }),
                ])
            ])
        ])
    ]
})
export class AppComponent implements OnInit{
    getState(outlet) {
        return outlet.activatedRouteData.state;
    }
    ngOnInit() {}
    ngAfterViewInit() {
        
    }
}
