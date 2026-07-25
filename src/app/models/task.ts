export default interface Task {
  id: number;
  name: string;
  position: number;
  kanban_column_id: number;
  due?: string;
  priority?: TaskPriority;
  tag_id?: number;
}

export enum TaskPriority {
  Low = "Low",
  Medium = "Medium",
  High = "High"
}
