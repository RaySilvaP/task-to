import type { Phase } from '../pages/pomodoro-page/pomodoro-page';

export default interface PomodoroState {
  phase: Phase;
  startedAt: string;
  pausedRemaining: number | null;
  workSessionsCompleted: number;
}
