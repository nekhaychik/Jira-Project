import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainPageComponent} from './main-page/main-page.component';
import {AuthComponent} from './auth/auth.component';
import {AuthGuard} from './services/auth/auth.guard';
import {Paths} from './enums';
import {BoardComponent} from './board/board.component';
import {BarChartComponent} from './bar-chart/bar-chart.component';
import {StatisticsComponent} from './statistics/statistics.component';
import {CardLinkComponent} from './card-link/card-link.component';

const routes: Routes = [
  {path: '', redirectTo: '/' + Paths.board, pathMatch: 'full'},
  {
    path: Paths.board, canActivate: [AuthGuard], component: MainPageComponent,
    children: [{
      path: ':id',
      component: BoardComponent,
      children: [{
        path: ':id',
        component: CardLinkComponent
      }]
    }
    ]
  },
  {path: Paths.authorization, component: AuthComponent},
  {
    path: Paths.statistics, canActivate: [AuthGuard], component: StatisticsComponent,
    children: [{
      path: ':id',
      component: BarChartComponent
    }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
