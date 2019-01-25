import { AuthenticationService } from './authentication.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { HttpModule, JsonpModule, Headers, RequestOptions, Http, Response, } from '@angular/http'


@Injectable()
export class DatabaseService {
    private url = "http://api.autdmcst.ir/api/v2";
    tokenType = "Bearer "

    constructor(
        private http: Http,
        private auth: AuthenticationService
    ) { }
    
    workshopRegister(data, items, mode) {
        console.log(data);
        console.log(items);
        
        
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions ({headers: headers});
        let requestData = {
            email: data.email,
            fname: data.fname,
            lname: data.lname,
            phone: data.phone,
            items: items,
            payment_mode: mode
        }
        
        return this.http.post(this.url + '/workshop/register', requestData, options)
        .map(this.extractData);
        
    }

    competitionRegister(data, teamName, teamLead) {
        console.log(data);

        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions ({headers: headers});
        let requestData = {
            team_members: data,
            team_name: teamName,
            team_lead: teamLead
        }

        return this.http.post(this.url + '/signup', requestData, options)
        .map(this.extractData);
    }
    
    private extractData(res: Response) {
        let body = res.json()
        return body;
    }

    checkPayment(authority) {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions ({headers: headers});
        let requestData = {
            authority: authority
        }
                
        return this.http.post(this.url + '/workshop/getuser', requestData, options)
        .map(this.extractData);
    }

    panelLogin(data) {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions ({headers: headers});
        const requestData = {
            username: data['username'],
            password: data['password']
        }
        return this.http.post(this.url + '/admin-login', requestData, options)
        .map(this.extractData)
    }

    getTeams(token) {
        let headers = new Headers({'Authorization': this.tokenType + token});
        let options = new RequestOptions ({headers: headers});
        
        console.log(options);
        
        return this.http.get(this.url + '/teams', options)
        .map(this.extractData);
    }

    validateTeam(teamId, token) {
        let headers = new Headers({'Authorization': this.tokenType + token});
        let options = new RequestOptions ({headers: headers});

        return this.http.post(this.url + '/teams/' + teamId + '/accept', null, options)
        .map(this.extractData)
    }

    getSubmittionHistory() {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions ({headers: headers});
        const requestData = {
            token: this.auth.token
        }

        return this.http.post(this.url + '/submittion/getHistory', requestData, options)
        .map(this.extractData)
    }

    getTeamDashboard() {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': this.tokenType + this.auth.getToken()
        });
        let options = new RequestOptions ({headers: headers});
        
        return this.http.get(this.url + '/dashboard', options)
        .map(this.extractData)
    }

    getProblems() {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions ({headers: headers});

        return this.http.get(this.url + '/problems', options)
        .map(this.extractData)
    }

    submitFile(problemID, file) {
        let headers = new Headers({
            'Authorization': this.tokenType + this.auth.getToken()
        });
        let options = new RequestOptions ({headers: headers});
        
        let formData = new FormData()
        formData.append('submit-file', file, file.name)

        return this.http.post(this.url + '/submission/' + problemID, formData, options)
        .map(this.extractData)
    }

    getScoreBoard() {
        return this.http.get(this.url + '/scoreboard')
        .map(this.extractData)
    }
}