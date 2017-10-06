import { AuthenticationService } from '../_service/authentication.service';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    private pageDimmed = false;
    private haveUser = false;
    private user: any = {}

    constructor(
        private auth: AuthenticationService
    ) { }
    
    ngOnInit() {
        console.log(this.auth.getUser());
        
        if (this.auth.getUser()) {
            this.haveUser = true;
            this.user = this.auth.getUser()
        }
    }
    
}
