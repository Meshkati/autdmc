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
    private url = "http://api.autdmc.ir/api/v2";
    token: string;
    private authEvents: Subject<AuthState>
    
    constructor(
        private http: Http
    ) {
        let currentUser = null;
        if (localStorage.getItem('currentUser')) {
            currentUser = JSON.parse(localStorage.getItem('currentUser'))
        }
        if (!(currentUser == null || currentUser == undefined)) {
            this.token = currentUser
        }
    }
    
    login(username: string, password: string):Observable<number> {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions ({headers: headers});
        const requestData = {
            username: username,
            password: password
        }

        // Forgive me for this code
        return this.http.post(this.url + '/login', requestData, options)
        .map((response: Response) => {    
            console.log(response);
            console.log(response.json());
            
            
            let token = response.json() && response.json().token
            
            if (token) {
                this.token = token
                
                localStorage.setItem('currentUser', JSON.stringify(response.json().token))
                this.authEvents.next(AuthState.Login)
                return response.status
            } else {
                if (response.status == 403) {
                    if (response.json()['errorCode'] == 1003) {
                        return 1003
                    }
                }

                return response.status
            }
        })
        .catch(response => {
            if (response.status == 403) {
                if (response.json()['errorCode'] == 1003) {
                    return Observable.throw(1003)
                }
            }
            
            return Observable.throw(response.status)
        })
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
    
    public getToken() {
        if (this.token) {
            return this.token
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