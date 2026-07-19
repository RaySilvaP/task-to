import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';
import TimeBlock from '../models/timeBlock';

@Injectable()
export class TimeBlockService {
  public async getByDay(date: string) {
    return await invoke<TimeBlock[]>('get_time_blocks_by_day', { date });
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
