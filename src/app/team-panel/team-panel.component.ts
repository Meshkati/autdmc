import { Router } from '@angular/router';
import { AuthenticationService } from '../_service/authentication.service';
import { Component, OnInit } from '@angular/core';

enum MenuState {
    questions = 0,
    submit,
    teamInfo,
    logout
}

@Component({
    selector: 'app-team-panel',
    templateUrl: './team-panel.component.html',
    styleUrls: ['./team-panel.component.css']
})

export class TeamPanelComponent implements OnInit {
    private menuState = MenuState.questions

    constructor(
        private auth: AuthenticationService,
        private router: Router
    ) { }
    
    ngOnInit() {
    }
    
    logout() {
        this.auth.logout()

        this.router.navigate([''])
    }
}
