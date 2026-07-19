export default interface TimeBlock {
  id: number;
  name: string;
  start_date_time: string;
  duration: number;
  task_id?: number;
  overlap_order: number;
}
