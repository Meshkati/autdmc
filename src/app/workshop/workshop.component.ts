import { NgForm } from '@angular/forms/src/directives';
import { DatabaseService } from '../database.service';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-workshop',
    templateUrl: './workshop.component.html',
    styleUrls: ['./workshop.component.css']
})
export class WorkshopComponent implements OnInit {
    soldItems = [false, false, false ,false];
    prices = [25000, 10000, 75000, 20000];
    totalPrice = 0;
    signs = [1, 1, 1, 1];
    registerResponse;

    constructor(
        private dbs: DatabaseService
    ) { }
    
    ngOnInit() {
    }

    public togglePurchaseItem(itemId) {
        this.soldItems[itemId] = !this.soldItems[itemId];
        this.totalPrice += this.signs[itemId] * this.prices[itemId];
        this.signs[itemId] *= -1;
    }

    sendRegisterRequest(loginForm: NgForm) {
        this.dbs.workshopRegister(loginForm.value, this.soldItems).subscribe(
            res => {
                console.log(res);
                console.log(res.length);
                if (res.length == 1) {
                    this.registerResponse = res[0];
                }
            },
            err => {
                console.log('workshop register error');
                
            }
        )
    }
    
}
