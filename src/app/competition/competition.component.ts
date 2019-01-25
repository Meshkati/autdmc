import { DatabaseService } from '../_service/database.service';
import { NgForm } from '@angular/forms/src/directives';
import { SuiSelectOption } from 'ng2-semantic-ui/dist';
import { Component, OnInit } from '@angular/core';

export interface IMember {
    first_name: string;
    last_name: string;
    email: string;
    cellphone: any;
}

@Component({
    selector: 'app-competition',
    templateUrl: './competition.component.html',
    styleUrls: ['./competition.component.css']
})
export class CompetitionComponent implements OnInit {
    teamNumber = Array<number>();
    teamSizeLimitation = 3;
    private errorMessage
    private isRegisterOver: boolean = false;
    constructor(
        private dbs: DatabaseService
    ) { }
    
    ngOnInit() {
        this.teamNumber.push(1)
    }
    
    
    sendRegisterRequest(registerForm: NgForm) {
        let data = registerForm.value;
        console.log(data);
        
        let teamName = registerForm.value['tname']
        let members = new Array<IMember>();
        console.log(members.length);
        
        
        for (let index = 1; index <= this.teamNumber.length; index++) {
            let member: IMember = {
                first_name: data['fname' + index],
                last_name: data['lname' + index],
                email: data['email' + index],
                cellphone: data['phone' + index]
            }
            
            members.push(member)
        }
        
        this.dbs.competitionRegister(members, teamName, members.pop()).subscribe(
            res => {
                console.log(res);
                let status = res['result']['ok']
                if (status === 1) {
                    if ((window.location.href = "https://educenter.aut.ac.ir/dmc2019") == undefined) {
                        window.open("https://educenter.aut.ac.ir/dmc2019");
                    }
                } else if (status == 1001) {
                    this.errorMessage = 'تمام ورودی‌ها را پر کنید'
                } else if (status == 1002) {
                    this.errorMessage = 'تیمی با این نام وجود دارد'
                } else if (status == 1003) {
                    this.errorMessage = 'کاربر با ایمیل ' + res['data'] + ' در یکی از تیم‌ها وجود دارد'   
                }
            },
            err => {
                console.log('competition register error');
                console.error(err);
                
            }
        )
    }
    
    addMember() {
        if (this.teamNumber.length < this.teamSizeLimitation) {
            this.teamNumber.push(this.teamNumber.length + 1);
        }
    }
    
    removeMember() {
        if (this.teamNumber.length > 1) {
            this.teamNumber.pop();
        }
    }
}
