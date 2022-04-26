import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from "uuid";
import { SocketioService } from 'src/app/services/socketio.service';
import { SharedService } from 'src/app/app-routing.module';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})

export class LobbyComponent implements OnInit {

  sharedData:string;

  constructor(private router: Router,
    private socketioService: SocketioService, 
    private sharedService: SharedService
    ) { }

  ngOnInit(): void {
      
  }

  createGame() {
    const uuid = uuidv4();
    var gameData = {
      uuid : uuid,
      playerName : (<HTMLInputElement>document.getElementById("playerName")).value
    };

    this.sharedService.sharedData.subscribe(sharedData => this.sharedData = sharedData)
    this.sharedService.sendData(gameData.playerName)

    console.log(gameData)

    this.router.navigate(['/game' , gameData.uuid]);
    this.socketioService.create(gameData);
  }

  /* join game button redirect */
  joinGame() {
    var gameData = {
      uuid : (<HTMLInputElement>document.getElementById("uuid")).value, 
      playerName : (<HTMLInputElement>document.getElementById("playerNameJoinGame")).value
    };
    //let uuid : string = (<HTMLInputElement>document.getElementById("uuid")).value; 

    this.sharedService.sharedData.subscribe(sharedData => this.sharedData = sharedData)
    this.sharedService.sendData(gameData.playerName)

    console.log(gameData)

    this.router.navigate(['/game' , gameData.uuid]);
    this.socketioService.connect(gameData);
  }
}

