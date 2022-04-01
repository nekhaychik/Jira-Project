import { List } from '../../board-list/models/list';

export interface Board {
  id: number,
  name: string,
  members: string[],
  lists?: List[]
}
