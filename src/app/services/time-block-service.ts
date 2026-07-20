import { Injectable, signal } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';
import TimeBlock from '../models/timeBlock';

@Injectable()
export class TimeBlockService {
  private readonly today = new Date(Date.now());
  private lastDay = new Date(this.today.getTime() - this.today.getTimezoneOffset() * 60 * 1000).toISOString().slice(0, 10);
  private readonly _timeBlocks = signal<TimeBlock[]>([]);
  public readonly timeBlocks = this._timeBlocks.asReadonly();

  public async loadByDay(date: string) {
    this.lastDay = date;
    const timeBlocks = await invoke<TimeBlock[]>('get_time_blocks_by_day', { date });
    this._timeBlocks.set(timeBlocks);
  }

  public async loadByLastDay() {
    const timeBlocks = await invoke<TimeBlock[]>('get_time_blocks_by_day', { date: this.lastDay });
    this._timeBlocks.set(timeBlocks);
  }

  public async add(timeBlock: TimeBlock) {
    await invoke('add_time_block', { timeBlock });
  }

  public async edit(blockId: number, timeBlock: TimeBlock) {
    await invoke('edit_time_block', { blockId, timeBlock });
  }

  public async delete(blockId: number) {
    await invoke('delete_time_block', { blockId });
  }
}
