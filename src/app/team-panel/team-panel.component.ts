import { DatabaseService } from '../_service/database.service';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_service/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FileUploader, FileSelectDirective} from 'ng2-file-upload';

enum MenuState {
    questions = 0,
    submit,
    teamInfo,
    logout
}

export interface SubmittionHistory {
    fileName: string
    uploadTime: string
    user: string
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
    private uploadURL = '/api/submittion/upload';
    private isUploading = false
    private errorMessage: string
    private submittionHistory
    public uploader:FileUploader = new FileUploader({url: this.uploadURL, authToken: this.auth.token});
    
    constructor(
        private auth: AuthenticationService,
        private router: Router,
        private http: Http,
        private dbs: DatabaseService
    ) {
    }
    
    ngOnInit() {
        this.team = JSON.parse(localStorage.getItem('currentUser'))
        
        this.getHistory()

        setInterval((dbs) => {
            dbs.getSubmittionHistory().subscribe(res => {
                this.submittionHistory = <Array<SubmittionHistory>>res;
            })
        }, 5000, this.dbs)
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
        
        this.http.post("/api/getData", requestData, options)
        .subscribe(res =>{
            if ((window.location.href = '/api/getData?file=' + this.fileName) == undefined) {
                window.open('/api/getData?file=' + this.fileName);
            }
        })
    }
    
    upload() {
        if (!this.isUploading) {
            const fileSize = this.uploader.queue[0].file.size
            if (fileSize / 1024 / 1024 > 50) {
                this.errorMessage = 'حجم فایل باید کمتر از ۵۰ مگابایت باشد.'
            } else {
                this.errorMessage = ''
                this.isUploading = true
                this.uploader.queue[0].upload()
                this.getHistory()
            }
        }
    }
    
    clearUploader() {
        this.isUploading = false
        this.errorMessage = ''
        this.uploader.clearQueue()
    }
    
    getHistory() {
        this.dbs.getSubmittionHistory().subscribe(res => {
            this.submittionHistory = <Array<SubmittionHistory>>res;
        })
    }
}
