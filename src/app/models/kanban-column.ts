import Task from "./task";

export default interface KanbanColumn {
  id: number;
  name: string;
  position: number;
  context_id: number;
  tasks: Task[];
}
