import {NgDompurifySanitizer} from '@tinkoff/ng-dompurify';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {environment} from '../environments/environment';
import {AngularFireModule} from '@angular/fire/compat';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';
import {AngularFirestoreModule} from '@angular/fire/compat/firestore';
import {AngularFireStorageModule} from '@angular/fire/compat/storage';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DragDropModule} from '@angular/cdk/drag-drop';

import {
  TuiRootModule,
  TuiDialogModule,
  TuiNotificationsModule,
  TUI_SANITIZER,
  TuiLinkModule,
  TuiButtonModule,
  TuiScrollbarModule
} from '@taiga-ui/core';
import {
  TuiAvatarModule
} from '@taiga-ui/kit';
import {TuiSidebarModule} from '@taiga-ui/addon-mobile';
import {TuiActiveZoneModule} from '@taiga-ui/cdk';

import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

import {NgChartsModule} from 'ng2-charts';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {SvgImageComponent} from './svg-image/svg-image.component';
import {NavigationComponent} from './header/navigation/navigation.component';
import {ButtonComponent} from './button/button.component';
import {AvatarComponent} from './avatar/avatar.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {BoardComponent} from './board/board.component';
import {BoardListComponent} from './board-list/board-list.component';
import {TaskCardComponent} from './task-card/task-card.component';
import {AuthComponent} from './auth/auth.component';
import {MainPageComponent} from './main-page/main-page.component';
import {ListFormComponent} from './list-form/list-form.component';
import {ListFormUpdateComponent} from './list-form-update/list-form-update.component';
import {CardFormComponent} from './card-form/card-form.component';
import {CardFormUpdateComponent} from './card-form-update/card-form-update.component';
import {FullCardComponent} from './full-card/full-card.component';
import {BoardFormComponent} from './board-form/board-form.component';
import {MembersFormComponent} from './members-form/members-form.component';
import {BoardUpdateComponent} from './board-update/board-update.component';
import {BarChartComponent} from './bar-chart/bar-chart.component';
import {StatisticsComponent} from './statistics/statistics.component';
import {CardLinkComponent} from './card-link/card-link.component';
import {FilterPipe} from './filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SvgImageComponent,
    NavigationComponent,
    ButtonComponent,
    AvatarComponent,
    SidebarComponent,
    BoardComponent,
    BoardListComponent,
    TaskCardComponent,
    AuthComponent,
    MainPageComponent,
    ListFormComponent,
    ListFormUpdateComponent,
    CardFormComponent,
    CardFormUpdateComponent,
    FullCardComponent,
    BoardFormComponent,
    MembersFormComponent,
    BoardUpdateComponent,
    BarChartComponent,
    StatisticsComponent,
    CardLinkComponent,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TuiRootModule,
    BrowserAnimationsModule,
    TuiDialogModule,
    TuiNotificationsModule,
    TuiLinkModule,
    TuiButtonModule,
    TuiAvatarModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    TuiScrollbarModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    MatMenuModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    DragDropModule,
    MatGridListModule,
    TuiSidebarModule,
    TuiActiveZoneModule,
    NgChartsModule,
    MatSidenavModule,
    FormsModule,
    MatAutocompleteModule
  ],
  providers: [{provide: TUI_SANITIZER, useClass: NgDompurifySanitizer}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
