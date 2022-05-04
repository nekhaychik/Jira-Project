import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainPageComponent} from './main-page/main-page.component';
import {AuthComponent} from './auth/auth.component';
import {AuthGuard} from './services/auth/auth.guard';
import {Paths} from "./enums";
import {BoardComponent} from "./board/board.component";

const routes: Routes = [
  {path: '', redirectTo: '/' + Paths.board, pathMatch: 'full'},
  {
    path: Paths.board, canActivate: [AuthGuard], component: MainPageComponent,
    children: [{
      path: ':id/:name',
      component: BoardComponent
    }
    ]
  },
  {path: Paths.authorization, component: AuthComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
