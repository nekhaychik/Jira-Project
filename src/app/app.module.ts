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
import { AuthComponent } from './auth/auth.component';
import { MainPageComponent } from './main-page/main-page.component';

import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import {MatMenuModule} from "@angular/material/menu";

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
    MainPageComponent
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
    MatMenuModule
  ],
  providers: [ { provide: TUI_SANITIZER, useClass: NgDompurifySanitizer } ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
