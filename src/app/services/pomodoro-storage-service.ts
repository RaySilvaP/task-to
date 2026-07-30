import { Injectable } from '@angular/core';
import type PomodoroState from '../models/pomodoroState';
import type PomodoroSettings from '../models/pomodoroSettings';

const STATE_KEY = 'pomodoro_state';
const SETTINGS_KEY = 'pomodoro_settings';

@Injectable()
export class PomodoroStorageService {

  saveState(state: PomodoroState): void {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  }

  loadState(): PomodoroState | null {
    const raw = localStorage.getItem(STATE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as PomodoroState;
    } catch {
      return null;
    }
  }

  clearState(): void {
    localStorage.removeItem(STATE_KEY);
  }

  saveSettings(settings: PomodoroSettings): void {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  loadSettings(): PomodoroSettings | null {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as PomodoroSettings;
    } catch {
      return null;
    }
  }
}
