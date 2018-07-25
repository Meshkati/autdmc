import { Observable, Subject } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Injectable } from '@angular/core';

export enum AuthState{
    Logout = 0,
    Login
}

@Injectable()
export class AuthenticationService {
    private url = "/api";
    token: string;
    private authEvents: Subject<AuthState>
    
    constructor(
        private http: Http
    ) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'))
        if (!(currentUser == null || currentUser == undefined)) {
            this.token = currentUser['token']
        }
    }
    
    login(username: string, password: string):Observable<number> {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions ({headers: headers});
        const requestData = {
            username: username,
            password: password
        }
        
        return this.http.post(this.url + '/login', requestData, options)
        .map((response: Response) => {
            console.log(response);
            
            let token = response.json() && response.json().token
            
            if (token) {
                this.token = token
                
                localStorage.setItem('currentUser', JSON.stringify(response.json()))
                this.authEvents.next(AuthState.Login)
                return response.json().status
            } else {
                return response.json().status
            }
        });
    }
    
    logout() {
        console.log('logout');
        
        this.token = null;
        localStorage.setItem('currentUser', '')
        
        this.authEvents.next(AuthState.Logout)
    }
    
    private extractData(res: Response) {
        let body = res.json()
        return body;
    }
    
    public getUser() {
        if (this.token) {
            return JSON.parse(localStorage.getItem('currentUser'))
        } else {
            return null
        }
    }
    
    public events() {
        if (!this.authEvents) {
            this.authEvents = new Subject<AuthState>()
        }
        
        return this.authEvents
    }
}