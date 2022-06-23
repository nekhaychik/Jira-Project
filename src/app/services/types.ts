export type Navigation = {
  name: string;
  path: string;
}

export type Board = {
  name: string;
  membersID: string[];
};

export type List = {
  name: string;
  boardID?: string;
  dragID?: string;
  dateCreating?: number;
  createdBy?: string | null;
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
  description?: string;
  dueDate: DueDate;
  reporterID: string;
  createDate: string;
  updateDate: string;
  images?: string[];
  position: number;
  history: string[];
};

export type User = {
  name: string;
  uid: string;
  avatarURL: string | null;
};

export type ID = {
  id: string;
}

export type UserStore = User & ID;
export type ListStore = List & ID;
export type CardStore = Card & ID;
export type BoardStore = Board & ID;
