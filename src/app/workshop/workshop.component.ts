import { NgForm } from '@angular/forms/src/directives';
import { DatabaseService } from '../_service/database.service';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-workshop',
    templateUrl: './workshop.component.html',
    styleUrls: ['./workshop.component.css']
})
export class WorkshopComponent implements OnInit {
    soldItems = [false, false, false ,false];
    prices = [60, 90, 120, 150];
    totalPrice = 0;
    signs = [1, 1, 1, 1];
    registerResponse;
    paymentRadio = 3;

    constructor(
        private dbs: DatabaseService
    ) { }
    
    ngOnInit() {
    }

    public togglePurchaseItem(itemId) {
        this.soldItems[itemId] = !this.soldItems[itemId];
        this.totalPrice += this.signs[itemId] * this.prices[this.paymentRadio];
        this.signs[itemId] *= -1;        
    }

    priceChanged() {
        this.totalPrice = 0

        this.soldItems.forEach(element => {
            if (element) {
                this.totalPrice += this.prices[this.paymentRadio];
            }
        })
    }

    sendRegisterRequest(loginForm: NgForm) {
        this.dbs.workshopRegister(loginForm.value, this.soldItems, this.paymentRadio).subscribe(
            res => {
                console.log(res);
                if (res['status'] == 200) {
                    if ((window.location.href = res['url']) == undefined)
                        window.open(res['url']);
                }
            },
            err => {
                console.log('workshop register error');
                
            }
        )
    }
    
}
