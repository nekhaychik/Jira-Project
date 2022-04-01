import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  TuiRootModule,
  TuiDialogModule,
  TuiNotificationsModule,
  TUI_SANITIZER,
  TuiLinkModule,
  TuiButtonModule,
  TuiScrollbarModule
} from '@taiga-ui/core';
import { TuiAvatarModule } from '@taiga-ui/kit';
import { MatCardModule } from '@angular/material/card';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SvgImageComponent } from './svg-image/svg-image.component';
import { NavigationComponent } from './header/navigation/navigation.component';
import { ButtonComponent } from './button/button.component';
import { AvatarComponent } from './avatar/avatar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BoardComponent } from './board/board.component';
import { BoardListComponent } from './board-list/board-list.component';
import { TaskCardComponent } from './task-card/task-card.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

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
    TaskCardComponent
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
  ],
  providers: [ { provide: TUI_SANITIZER, useClass: NgDompurifySanitizer } ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
