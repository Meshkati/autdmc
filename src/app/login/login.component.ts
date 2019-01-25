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
    private errorMessage: string = ''
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
                                
                if (res == 200) {
                    this.router.navigate(['/panel'])
                } else {
                    if (res == 2001) {
                        this.errorMessage = 'تمام فیلد ها را پر کنید'
                    } else if (res == 2002 || res == 2003) {
                        this.errorMessage = 'نام کاربری یا رمز عبور اشتباه است'
                    }                    
                }
                
            }
        )
    }
    
}
