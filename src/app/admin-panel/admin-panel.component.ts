import { SubmittionHistory } from '../team-panel/team-panel.component';
import { DatabaseService } from '../_service/database.service';
import { NgForm } from '@angular/forms/src/directives';
import { Component, OnInit } from '@angular/core';
import { IMember } from 'app/competition/competition.component';

export interface Team {
    _id: string
    team_name: string
    size: number
    team_lead: IMember
    team_members: Array<IMember>
    validated: boolean
}

@Component({
    selector: 'app-admin-panel',
    templateUrl: './admin-panel.component.html',
    styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
    private teams: Array<Team>
    private submittionHistories: Array<SubmittionHistory>
    private loggedIn = false;
    private token = "";

    constructor(
        private dbs: DatabaseService
    ) { }
    
    ngOnInit() {
    }
    
    login(form: NgForm) {
        const data = form.value
        this.dbs.panelLogin(data).subscribe(
            res => {
                this.token = res['token'];
                console.log(this.token);
                
                if (this.token === null || this.token === undefined) {
                    console.log("Bad token");
                } else {
                    this.loggedIn = true;
                    this.dbs.getTeams(this.token).subscribe(
                        res => {
                            this.parseTeams(res);
                            console.log(this.teams);
                            
                        },
                        error => {
                            console.log('Error on getting teams');
                            console.error(error)
                        }
                    )
                }
                
                
            },
            error => {
                console.log("Failed!!");
                console.error(error)
                
            }
        )
    }

    parseTeams(teamsData) {
        this.teams = <Array<Team>>teamsData;
        for (let team of this.teams) {
            team.size = team.team_members.length + 1;
        }
    }

    validateTeam(teamId) {
        this.dbs.validateTeam(teamId, this.token).subscribe(
            res => {
                console.log(res);
                for(let team of this.teams) {
                    if (team._id == teamId) {
                        let index = this.teams.indexOf(team);
                        this.teams[index] = <Team>res;
                    }
                }
                
            }, 
            error => {
                console.log('Error on validating team ' + teamId);
                console.error(error);
            }
        )
    }
    
}
