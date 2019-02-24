import { Component, OnInit } from '@angular/core';
import { IScoreBoardEntry } from 'app/team-panel/team-panel.component';
import { DatabaseService } from 'app/_service/database.service';

@Component({
  selector: 'app-public-scoreboard',
  templateUrl: './public-scoreboard.component.html',
  styleUrls: ['./public-scoreboard.component.css']
})
export class PublicScoreboardComponent implements OnInit {
  private scoreBoard: Array<IScoreBoardEntry>
  private finalResult: Array<IFinalResult>

  constructor(
    private dbs: DatabaseService
  ) { }

  ngOnInit() {
    this.dbs.getFinalScoreBoard().subscribe(
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

  this.dbs.getFinalResult().subscribe(
    res => {
      let result = <Array<IFinalResult>>res
      // result.sort((a, b) => {
      //   if (a.rank > b.rank)
      //     return 1
      //   if (a.rank == b.rank)
      //     return 0
      //   return -1
      // }
      // )
      this.finalResult = result
    },
    err => {
      console.log("Error on getting FinalResult!");
      console.error(err);
    }
  )
  }

}

export class IFinalResult {
  rank: number
  team_name: string
  model_score: number
  business_understanding_score: number
  raw_error: number
  estimation_score: number
  final: number
  status: string
}