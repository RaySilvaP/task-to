import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';

export type SessionType = 'Work' | 'Rest' | 'BigRest';

@Injectable()
export class PomodoroService {

  public scheduleAlarm(sessionType: SessionType, endsAt: string) {
    return invoke('schedule_session', { sessionType, endsAt });
  }

  public cancelAlarm() {
    return invoke('cancel_session');
  }
}
