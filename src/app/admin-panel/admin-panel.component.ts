import { SubmittionHistory } from '../team-panel/team-panel.component';
import { DatabaseService } from '../_service/database.service';
import { NgForm } from '@angular/forms/src/directives';
import { Component, OnInit } from '@angular/core';

export interface Member {
    fname: string
    lname: string
    email: string
    phone: string
}

export interface Team {
    name: string
    size: number
    members: Array<Member>
}

@Component({
    selector: 'app-admin-panel',
    templateUrl: './admin-panel.component.html',
    styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
    private teams: Array<Team>
    private submittionHistories: Array<SubmittionHistory>
    private loggedIn = false

    constructor(
        private dbs: DatabaseService
    ) { }
    
    ngOnInit() {
    }
    
    login(form: NgForm) {
        const data = form.value
        this.dbs.panelLogin(data).subscribe(
            res => {
                this.teams = <Array<Team>>res['teams']
                this.submittionHistories = <Array<SubmittionHistory>>res['submittions']
                this.loggedIn = true
                console.log(this.submittionHistories);
                console.log(this.teams);
                
                
            }
        )
    }
    
}
