export default interface Task {
  id: number;
  name: string;
  position: number;
  kanban_column_id: number;
  due?: string;
}
