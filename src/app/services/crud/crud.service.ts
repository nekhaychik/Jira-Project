import {Injectable} from '@angular/core';
import {Action, AngularFirestore, DocumentSnapshot} from '@angular/fire/compat/firestore';
import {from, map, Observable, take} from 'rxjs';
import firebase from 'firebase/compat/app';
import DocumentReference = firebase.firestore.DocumentReference;

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  constructor(private angularFirestore: AngularFirestore) {
  }

  public getDataDoc<T>(collectionName: string, id: string): Observable<T | undefined> {
    const snapshot: Observable<firebase.firestore.DocumentSnapshot<T>> = this.angularFirestore
      .collection(collectionName)
      .doc(id)
      .get() as Observable<firebase.firestore.DocumentSnapshot<T>>;
    return snapshot.pipe(
      map((value: firebase.firestore.DocumentSnapshot<T>) => value.data())
    );
  }

  public handleData<T>(collectionName: string): Observable<T[]> {
    return this.angularFirestore
      .collection(collectionName)
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data: any = a.payload.doc.data();
            const {id} = a.payload.doc;
            return {id, ...data} as T;
          }),
        ),
      );
  }

  public fetchOneDocumentFromFirestore<T>(collectionName: string, id: string): Observable<T | null> {
    return this.angularFirestore.collection(collectionName).doc(id).snapshotChanges()
      .pipe(
        map((snapshot: Action<DocumentSnapshot<T | any>>) => {
          const {id, exists} = snapshot.payload;
          const data = snapshot.payload.data();
          return exists
            ?
            {
              id: id,
              ...data,
            } as T
            : null;
        })
      )
  }

  public getDate<T>(collectionName: string): Observable<T[]> {
    return this.handleData<T>(collectionName).pipe(take(1));
  }

  public createObject<T>(collectionName: string, object: T): Observable<DocumentReference<T>> {
    return (from(this.angularFirestore
      .collection(collectionName)
      .add(object)) as Observable<DocumentReference<T>>).pipe(take(1));
  }

  public updateObject(collectionName: string, id: string, data: {}): Observable<void> {
    return from(
      this.angularFirestore
        .collection(collectionName)
        .doc(id)
        .set(data, {merge: true}),
    ).pipe(take(1));
  }

  public getOneData(collectionName: string, id: string) {
    return from(this.angularFirestore
      .collection(collectionName)
      .doc(id)
      .get()
    ).pipe(take(1));
  }

  public deleteObject(collectionName: string, id: string): Observable<void> {
    return from(
      this.angularFirestore
        .collection(collectionName)
        .doc(id)
        .delete()
    ).pipe(take(1));
  }

}
