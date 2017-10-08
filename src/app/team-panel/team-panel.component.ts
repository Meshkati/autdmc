import { Http, RequestOptions, Headers } from '@angular/http';
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
    private team: any;
    private fileName;
    
    constructor(
        private auth: AuthenticationService,
        private router: Router,
        private http: Http
    ) {
        
    }
    
    ngOnInit() {
        this.team = JSON.parse(localStorage.getItem('currentUser'))
    }
    
    logout() {
        this.auth.logout()
        
        this.router.navigate([''])
    }
    
    downloadFile(fileName) {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions ({headers: headers});
        
        const requestData = {
            token: JSON.parse(localStorage.getItem('currentUser')).token,
            file: fileName
        }

        this.fileName = fileName

        console.log(requestData)
        this.http.post("/api/getData", requestData, options)
        .subscribe(res =>{
            if ((window.location.href = '/api/getData?file=' + this.fileName) == undefined) {
                window.open('/api/getData?file=' + this.fileName);
            }
        })
    }
}
