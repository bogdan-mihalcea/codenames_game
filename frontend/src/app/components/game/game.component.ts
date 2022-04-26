import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { SocketioService } from 'src/app/services/socketio.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { SharedService } from 'src/app/app-routing.module';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

export class GameComponent implements OnInit {

  homepageUrl = 'https://codenames.bogdanmihalcea.ro';

  gameData: any;
  role = "none";
  words: any;
  joinedPlayers: any;

  timeLeft;
  interval;

  sharedData:string;

  constructor(
    private socketioService: SocketioService, 
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
    private clipboard: Clipboard,
    private sharedService: SharedService,
    private cdRef : ChangeDetectorRef
    ) {}

  copyText(textToCopy: string) {
      this.clipboard.copy(textToCopy);
      this.snackbar.open('ID-ul de joc a fost copiat cu succes!', '', {
        duration: 4000 /* 4 seconds */
      });
  }

  ngOnInit(): void {
    //this.gameId = this.route.snapshot.paramMap.get('id')!; /* ! -> non-null assertion 10/03/22  */

    this.sharedService.sharedData.subscribe(sharedData => this.sharedData = sharedData)

    if (this.sharedData === "undefined")
      window.location.href = this.homepageUrl;

    this.gameData = {
      uuid: this.route.snapshot.paramMap.get('id')!,
      playerName : this.sharedData
    };

    this.receiveGameUpdate();
  }

/*   newMessage() {
    this.sharedService.nextMessage1("Second Message")
  } */

  startGame(){
    //this.gameId = this.route.snapshot.paramMap.get('id')!; /* ! -> non-null assertion 10/03/22  */
    this.socketioService.startGame(this.gameData);
  }

  nextGame(){
    this.socketioService.startGame(this.gameData);
  }

  receiveGameUpdate(){
     // timer event
     this.socketioService.receiveTimerUpdate().subscribe((message) => {
      this.timeLeft = message;
    });   
    // updateJoinedPlayersList event
    this.socketioService.receiveJoinedPlayers().subscribe((message) => {
      this.snackbar.open(message + ' s-a alăturat!', '', {
        duration: 4000 /* 4 seconds */
      });
    });
    // playerDisconnect event
    this.socketioService.playerDisconnect().subscribe((message) => {
      this.snackbar.open(message + ' s-a deconectat!', '', {
        duration: 4000 /* 4 seconds */
      });
    });
    // updateJoinedPlayersList event
    this.socketioService.receiveJoinedPlayersList().subscribe((message) => {
      this.joinedPlayers = message;
    });
    // startGame event
    this.socketioService.receiveWords().subscribe((words) => {
      this.role = 'none';
      this.words = words;
      console.log(this.words);
      this.cdRef.detectChanges();
    });
    // gameData event
    this.socketioService.gameUpdate(this.gameData).subscribe((words) => {
      this.words = words;
      //console.log(this.joinedPlayers);
    });
    // startGameSnackbar event
    this.socketioService.receiveStartGameSnackbar().subscribe((message) => {
      this.snackbar.open(message + ' a început jocul!', '', {
        duration: 4000 /* 4 seconds */
      });
    });
    // redirect event
    this.socketioService.redirectHome().subscribe((message) => {
      window.location.href = message;
    });
  }
  
  clickWord(word){
    word.selected = true;
    this.socketioService.sendGameUpdate(this.gameData, this.words)
  }

  startTimer() {
    if (!this.interval) {
      this.interval = setInterval(() => {
        if(this.timeLeft > 0) {
          this.timeLeft--;
          this.socketioService.sendTimerUpdate(this.gameData, this.timeLeft)
        } else {
          this.timeLeft = 60;
          this.socketioService.sendTimerUpdate(this.gameData, this.timeLeft)
          clearInterval(this.interval);
          this.interval = null;
        }
      },1000)
    }
  }

  resetTimer() {
    this.timeLeft = 60;
    clearInterval(this.interval);
    this.interval = null;
    this.socketioService.sendTimerUpdate(this.gameData, this.timeLeft)
  } 

}
