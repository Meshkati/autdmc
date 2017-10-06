import { Router } from '@angular/router';
import { AuthenticationService } from '../_service/authentication.service';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    model: any = {};
    constructor(
        private auth: AuthenticationService,
        private router: Router
    ) { }
    
    ngOnInit() {
    }
    
    login() {
        console.log(this.model);
        this.auth.login(this.model.username, this.model.password)
        .subscribe(
            res => {
                console.log(res);
                
                if (res) {
                    console.log(res);
                    
                    this.router.navigate(['/panel'])
                }
                
            }
        )
    }
    
}
