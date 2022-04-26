import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './components/game/game.component';
import { LobbyComponent } from './components/lobby/lobby.component';
import { BehaviorSubject } from 'rxjs';

const routes: Routes = [
  { path: '', component: LobbyComponent },
  { path: 'game/:id', component: GameComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  
}

export class SharedService { 

  private message = new BehaviorSubject('undefined');
  sharedData = this.message.asObservable();

  constructor() { }

  sendData(message: string) {
    this.message.next(message)
  }
}
