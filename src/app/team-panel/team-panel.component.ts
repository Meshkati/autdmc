import { DatabaseService } from '../_service/database.service';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_service/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FileUploader, FileSelectDirective} from 'ng2-file-upload';
import { ITeam } from "../admin-panel/admin-panel.component";

enum MenuState {
    questions = 0,
    submit,
    teamInfo,
    importantNotes,
    logout,
    scoreBoard
}

export interface INews {
    title: string
    body: string
    date: Date
}

export interface IScoreBoardEntry {
    _id: string
    team_name: string
    score: number
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
    private menuState = MenuState.importantNotes
    private team: ITeam;
    private problems: Array<IProblem>
    private selectedProblem: IProblem
    private fileName;
    private uploadURL = '/api/submittion/upload';
    private isUploading = false
    private errorMessage: string
    private submittionHistory
    private selectedFile: File;
    private scoreBoard: Array<IScoreBoardEntry>
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

        this.dbs.getTeamDashboard().subscribe(
            res => {
                this.team = <ITeam>res["team"]
            },
            err =>{
                console.log("Error on getting team dashboard data");
                console.error(err);
            }
        )

        this.dbs.getProblems().subscribe(
            res => {
                this.problems = <Array<IProblem>>res
                this.selectedProblem = this.problems[0]
            },
            err => {
                console.log("Error on getting problems");
                console.error(err);
            }
        )

        this.dbs.getScoreBoard().subscribe(
            res => {
                this.scoreBoard = <Array<IScoreBoardEntry>>res
                this.scoreBoard.sort((a, b) => {
                    if (a.score > b.score)
                        return 1
                    if (a.score == b.score)
                        return 0
                    return -1
                })
            },
            err => {
                console.log("Error on getting ScoreBoard!");
                console.error(err);
            }
        )
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

    checkDayCounter(day) {
        const today = new Date().getTime();
        if ( day - today > 0) {
            return true
        }
        return false
    }

    onFileInputChanged(event) {
        console.log("Changing");
        this.selectedFile = event.target.files[0]
        console.log(this.selectedFile);
    }

    onUploadFile() {
        this.dbs.submitFile(this.selectedProblem._id, this.selectedFile).subscribe(
            res => {
                console.log(res);
            }, 
            err =>{
                console.log("Error on submitting answer");
                console.error(err);
            }
        )
    }

    toggleDownloadButton() {
        
    }
}

export class IProblem {
    _id: string
    title: string
    body: string
    submitted: boolean
}