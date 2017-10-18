import { AuthenticationService } from './authentication.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { HttpModule, JsonpModule, Headers, RequestOptions, Http, Response, } from '@angular/http'


@Injectable()
export class DatabaseService {
    private url = "/api";
    
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

    competitionRegister(data, num, teamName) {
        console.log(data);

        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions ({headers: headers});
        let requestData = {
            users: data,
            num: num,
            team_name: teamName
        }

        // return this.http.post(this.url + '/competition/register', requestData, options)
        // .map(this.extractData);
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
        return this.http.post(this.url + '/panel/getCompetition', requestData, options)
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
}