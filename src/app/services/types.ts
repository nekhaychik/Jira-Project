import firebase from "firebase/compat/app";

export type FireBaseUser = firebase.User | null;
export type UserCredential = firebase.auth.UserCredential;

export type Board = {
  name: string;
  membersID: string[];
  listsID?: string[];
};

export type List = {
  name: string;
  cardsID: string[];
};

export type Card = {
  name: string;
  priority: string;
  memberID: string;
  listID: string;
  checklist?: string;
  dueDate?: string;
};

export type User = {
  name: string;
};

export type ID = {
  id: string;
}

export type UserStore = User & ID;
export type ListStore = List & ID;
export type CardStore = Card & ID;
export type BoardStore = Board & ID;
