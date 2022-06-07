import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import {Observable, switchMap, take, tap} from 'rxjs';
import {CrudService} from '../crud/crud.service';
import {AuthService} from './auth.service';
import {BoardStore} from '../types';
import {Collection, Paths} from '../../enums';
import firebase from 'firebase/compat/app';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BoardGuard implements CanActivate {

  constructor(private crudService: CrudService,
              private router: Router,
              private authService: AuthService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.user$.pipe(
      switchMap((authUser: firebase.User | null) => {
        return this.crudService.getDataDoc<BoardStore>(Collection.BOARDS, route.params['id']).pipe(
          take(1),
          map((board: BoardStore | undefined) => board && authUser ? board.membersID.includes(authUser.uid) : false),
          tap((isAvailable: boolean) => {
            if (!isAvailable) {
              this.router.navigate([Paths.board])
            }
          }),
        );
      }),
    );
  }

}
