import { DatabaseService } from '../database.service';
import { NgForm } from '@angular/forms/src/directives';
import { SuiSelectOption } from 'ng2-semantic-ui/dist';
import { Component, OnInit } from '@angular/core';

export interface IMember {
    fname: string;
    lname: string;
    email: string;
    phone: any;
}

@Component({
    selector: 'app-competition',
    templateUrl: './competition.component.html',
    styleUrls: ['./competition.component.css']
})
export class CompetitionComponent implements OnInit {
    teamNumber = Array<number>();
    
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
                fname: data['fname' + index],
                lname: data['lname' + index],
                email: data['email' + index],
                phone: data['phone' + index]
            }
            
            members.push(member)
        }
        
        this.dbs.competitionRegister(members, this.teamNumber.length, teamName).subscribe(
            res => {
                console.log(res);
                if (res['status'] == 200) {
                    if ((window.location.href = res['url']) == undefined)
                        window.open(res['url']);
                }
            },
            err => {
                console.log('competition register error');
                
            }
        )
    }
    
    addMember() {
        if (this.teamNumber.length < 5) {
            this.teamNumber.push(this.teamNumber.length + 1);
        }
    }
    
    removeMember() {
        if (this.teamNumber.length > 1) {
            this.teamNumber.pop();
        }
    }
}
