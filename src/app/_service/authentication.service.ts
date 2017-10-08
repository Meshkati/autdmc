import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthenticationService {
    private url = "/api";
    token: string;

    constructor(
        private http: Http
    ) { }

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
                return response.json().status
            } else {
                return response.json().status
            }
        });
    }

    logout() {
        this.token = null;
        localStorage.setItem('currentUser', '')
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
}