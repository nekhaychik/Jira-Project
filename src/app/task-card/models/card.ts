export interface Card {
  id: number,
  name: string,
  priority: string,
  checklist?: string,
  member?: string
  dueDate?: string,
  // createdBy: string,
  // doneBy: string | undefined,
}
