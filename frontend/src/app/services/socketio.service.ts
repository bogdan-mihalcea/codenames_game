import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  socket: Socket;

  constructor() { }

  create(gameData){
    this.socket = io(environment.SOCKET_ENDPOINT);
    this.socket.emit('createGame', gameData);
  }

  connect(gameData){
    this.socket = io(environment.SOCKET_ENDPOINT);
    this.socket.emit('joinGame', gameData);
  }

  startGame(gameData){
    this.socket.emit('startGame', gameData);
  }

  sendGameUpdate(gameData, words) {
    this.socket.emit('gameUpdate', { gameData: gameData, words: words });
  }

  sendTimerUpdate(gameData, timeLeft) {
      this.socket.emit('sendTimerUpdate', { gameData : gameData, timeLeft: timeLeft});
  }

  receiveTimerUpdate() {
    return new Observable<string>((observer) => {
      this.socket.on('receiveTimerUpdate', function(timeLeft) {
        observer.next(timeLeft);
      } )
    });
  }

  receiveJoinedPlayers() {
    return new Observable<string>((observer) => {
      this.socket.on('joinGame', (message) => {
        observer.next(message);
      } )
    });
  }

  playerDisconnect() {
    return new Observable<string>((observer) => {
      this.socket.on('playerDisconnect', (message) => {
        observer.next(message);
      } )
    });
  }

  receiveJoinedPlayersList() {
    return new Observable<string>((observer) => {
      this.socket.on('updateJoinedPlayersList', (message) => {
        observer.next(message);
      } )
    });
  }

  receiveStartGameSnackbar() {
    return new Observable<string>((observer) => {
      this.socket.on('startGameSnackbar', (message) => {
        observer.next(message);
      } )
    });
  }

  receiveWords() {
    return new Observable<string>((observer) => {
      this.socket.on('startGame', (words) => {
        observer.next(words);
      } )
    });
  }

  gameUpdate(gameData) {
    /* 
    the type of Observable returned by our function is not specified, so it defaults to Observable<unknown>. 
    Observable is a generic type, so a Observable of a string is a Observable<string>. 
    */
    return new Observable<string>((observer) => {
      this.socket.on(gameData, (words) => {
        observer.next(words);
      } )
    });
  }

  // redirect home event when trying to join an empty room
  redirectHome() {
    return new Observable<string>((observer) => {
      this.socket.on('redirectHome', (message) => {
        observer.next(message);
      } )
    });
  }

}
