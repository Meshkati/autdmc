import { AuthenticationService, AuthState } from '../_service/authentication.service';
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

        this.auth.events().subscribe(
            (res:AuthState) => {
                console.log(res);
                
                if (res == AuthState.Logout) {
                    this.user = null
                    this.haveUser = false
                } else if (res == AuthState.Login) {
                    const tUser = JSON.parse(localStorage.getItem('currentUser'))
                    
                    this.user = tUser
                    this.haveUser = true
                }
            }
        )
    }
    
}
