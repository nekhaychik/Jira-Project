import { Board } from './board/models/board';
import { USERS } from './mock-users';
import { LISTS } from './mock-lists';

export const BOARDS: Board[] = [
  { id: 1, name: 'Board 1', members: USERS, lists: LISTS },
  { id: 2, name: 'Board 2', members: USERS },
  { id: 3, name: 'Board 3', members: USERS }
];
