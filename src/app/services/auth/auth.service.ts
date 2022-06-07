import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import {from, Observable, of, ReplaySubject} from 'rxjs';
import AuthProvider = firebase.auth.AuthProvider;
import UserCredential = firebase.auth.UserCredential;
import {switchMap} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {CrudService} from '../crud/crud.service';
import {Collection} from '../../enums';
import {UserStore} from '../types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user$: ReplaySubject<firebase.User | null> = new ReplaySubject<firebase.User | null>(1);

  constructor(private afAuth: AngularFireAuth,
              private firestoreService: AngularFirestore,
              private crudService: CrudService) {
    this.afAuth.authState.subscribe((value: firebase.User | null) => this.user$.next(value));
  }

  public googleSignIn(): Observable<UserCredential> {
    return this.authWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  public signOut(): Observable<void> {
    return from(this.afAuth.signOut());
  }

  public authWithPopup(provider: AuthProvider): Observable<any> {
    return from(this.afAuth.signInWithPopup(provider))
      .pipe(
        switchMap((credentials: any) => {
          return this.crudService.fetchOneDocumentFromFirestore<UserStore>(Collection.USERS, credentials.user.uid)
            .pipe(
              switchMap((user: UserStore | null) => {
                if (!user) {
                  const {user: credentialsUser} = credentials;
                  const userRef = this.firestoreService.collection(Collection.USERS).doc(credentialsUser.uid).set({
                    uid: credentialsUser.uid,
                    name: credentialsUser.displayName,
                    avatarURL: credentialsUser.photoURL,
                  }, {
                    merge: true,
                  });
                  return from(userRef);
                }
                return of(user);
              })
            )
        }),
      );
  }
}
