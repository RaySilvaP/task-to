import { Injectable, signal } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';
import Task from '../models/task';

const LAST_WEEK_CHECK_KEY = 'last-week-tasks-shown';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private _averageBlockDuration = signal<number>(0);
  public readonly averageBlockDuration = this._averageBlockDuration.asReadonly();

  async loadAverageBlockDuration() {
    const averageDuration = await invoke<number>('get_average_duration');
    this._averageBlockDuration.set(averageDuration);
  }

  async getWeekTasks(): Promise<Task[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return await invoke<Task[]>('get_tasks_by_week', { date: today.toISOString() });
  }

  showWeekTasks() {
    if(this.isTodayInTheSameWeek())
      return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    localStorage.setItem(LAST_WEEK_CHECK_KEY, today.toISOString());

    return true;
  }

  private isTodayInTheSameWeek(): boolean {
    const stored = localStorage.getItem(LAST_WEEK_CHECK_KEY);
    if (!stored) return false;

    const storedDate = new Date(stored);
    const currentDate = new Date();

    const getWeek = (date: Date): number => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
      const week1 = new Date(d.getFullYear(), 0, 4);
      return 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
    };

    return getWeek(storedDate) === getWeek(currentDate) && storedDate.getFullYear() === currentDate.getFullYear();
  }
}
