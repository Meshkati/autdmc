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

    constructor() { }
    
    ngOnInit() {
    }

    public togglePurchaseItem(itemId) {
        this.soldItems[itemId] = !this.soldItems[itemId];
        this.totalPrice += this.signs[itemId] * this.prices[itemId];
        this.signs[itemId] *= -1;
    }
    
}
