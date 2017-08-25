import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { HttpModule, JsonpModule, Headers, RequestOptions, Http, Response, } from '@angular/http'


@Injectable()
export class DatabaseService {
    private url = "http://127.0.0.1:3000/api";
    
    constructor(
        private http: Http
    ) { }
    
    workshopRegister(data) {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions ({headers: headers});
        let requestData = {
            email: data.email,
            
        }
        
        return this.http.post(this.url, requestData, options)
        .map(this.extractData);
        
    }
    
    private extractData(res: Response) {
        let body = res.json()
        return body;
    }
}