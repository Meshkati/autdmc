import { DatabaseService } from '../database.service';
import { ActivatedRoute, Params, Route, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
    private dataLoaded:boolean = false;
    private paymentData: any;

    constructor(
        private route: ActivatedRoute,
        private dbs: DatabaseService
    ) { }
    
    ngOnInit() {
        this.route.queryParams.subscribe((params: Params) => {
            this.dbs.checkPayment(params['authority']).subscribe(
                res =>{
                    this.paymentData = res;
                    this.dataLoaded = true;
                },
                err => {
                    console.log('error on payment component');
                    throw err;
                }
            )

        })
    }
    
}
