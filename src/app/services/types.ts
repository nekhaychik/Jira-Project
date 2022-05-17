import firebase from 'firebase/compat/app';

export type UserCredential = firebase.auth.UserCredential;

export type Board = {
  name: string;
  membersID: string[];
};

export type List = {
  name: string;
  boardID?: string;
  dragID?: string;
  dateCreating?: number;
};

export type DueDate = {
  nanoseconds?: number;
  seconds?: number;
}

export type Card = {
  name: string;
  priority: string;
  memberID: string;
  listID: string;
  checklist?: string;
  description?: string;
  dueDate: DueDate;
  reporterID: string;
  createDate: string;
  updateDate: string;
  images?: string[];
  position: number;
  history?: string[];
};

export type User = {
  name: string;
  uid: string;
  avatarUrl: string | null;
};

export type ID = {
  id: string;
}

export type UserStore = User & ID;
export type ListStore = List & ID;
export type CardStore = Card & ID;
export type BoardStore = Board & ID;
