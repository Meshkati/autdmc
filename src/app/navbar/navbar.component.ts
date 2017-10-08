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
        let user = localStorage.getItem('currentUser')
        
        if (user) {
            user = JSON.parse(user)
            console.log(user);
            
            this.haveUser = true;
            this.user = user
        }
    }
    
}
