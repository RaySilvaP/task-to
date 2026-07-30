import { Component, inject, signal, computed, OnDestroy, OnInit } from '@angular/core';
import { Button } from '../../shared/components/button/button';
import { InputField } from '../../shared/components/input-field/input-field';
import type PomodoroState from '../../models/pomodoroState';
import type PomodoroSettings from '../../models/pomodoroSettings';
import { PomodoroStorageService } from '../../services/pomodoro-storage-service';
import { PomodoroService } from '../../services/pomodoro-service';

export type Phase = 'work' | 'rest' | 'big-rest';

@Component({
  selector: 'app-pomodoro-page',
  imports: [Button, InputField],
  templateUrl: './pomodoro-page.html',
  styleUrl: './pomodoro-page.css',
  providers: [PomodoroStorageService, PomodoroService],
})
export class PomodoroPage implements OnInit, OnDestroy {
  private readonly storage = inject(PomodoroStorageService);
  private readonly pomodoroService = inject(PomodoroService);
  private readonly sessionTypeMap: Record<Phase, 'Work' | 'Rest' | 'BigRest'> = {
    work: 'Work',
    rest: 'Rest',
    'big-rest': 'BigRest',
  };

  readonly workTime = signal(25);
  readonly restTime = signal(5);
  readonly bigRestTime = signal(15);
  readonly workSessionsBeforeBigRest = signal(3);

  readonly phase = signal<Phase>('work');
  readonly workSessionsCompleted = signal(0);
  readonly remaining = signal(this.workTimeInSeconds());
  readonly isRunning = signal(false);

  private intervalId: ReturnType<typeof setInterval> | null = null;

  readonly displayTime = signal(this.formatTime(this.workTimeInSeconds()));
  readonly progress = signal(100);

  readonly phaseLabel = computed(() => {
    switch (this.phase()) {
      case 'work': return 'WORK';
      case 'rest': return 'REST';
      case 'big-rest': return 'BIG REST';
    }
  });

  readonly phaseDuration = computed(() => {
    switch (this.phase()) {
      case 'work': return this.workTimeInSeconds();
      case 'rest': return this.restTimeInSeconds();
      case 'big-rest': return this.bigRestTimeInSeconds();
    }
  });

  readonly nextLabel = computed(() => {
    switch (this.phase()) {
      case 'work': return 'Start Work';
      case 'rest': return 'Start Rest';
      case 'big-rest': return 'Start Big Rest';
    }
  });

  readonly showTopButton = computed(() =>
    !this.isRunning() && this.remaining() === this.phaseDuration(),
  );

  readonly showControls = computed(() =>
    this.isRunning() || this.remaining() !== this.phaseDuration(),
  );

  readonly settingsDisabled = computed(() => !this.showTopButton());

  private workTimeInSeconds(): number {
    return this.workTime() * 60;
  }

  private restTimeInSeconds(): number {
    return this.restTime() * 60;
  }

  private bigRestTimeInSeconds(): number {
    return this.bigRestTime() * 60;
  }

  ngOnInit(): void {
    const savedSettings = this.storage.loadSettings();
    if (savedSettings) {
      this.workTime.set(savedSettings.workTime);
      this.restTime.set(savedSettings.restTime);
      this.bigRestTime.set(savedSettings.bigRestTime);
      this.workSessionsBeforeBigRest.set(savedSettings.workSessionsBeforeBigRest);
    }

    const savedState = this.storage.loadState();
    if (savedState) {
      this.phase.set(savedState.phase);
      this.workSessionsCompleted.set(savedState.workSessionsCompleted);

      if (savedState.pausedRemaining !== null) {
        this.remaining.set(savedState.pausedRemaining);
      } else {
        const elapsed = Math.floor((Date.now() - new Date(savedState.startedAt).getTime()) / 1000);
        const remaining = this.phaseDuration() - elapsed;
        if (remaining <= 0) {
          this.onSessionComplete();
          return;
        }
        this.remaining.set(remaining);
        this.cancelAlarm();
        this.startTimer();
      }
      this.updateDisplay();
    } else {
      this.remaining.set(this.phaseDuration());
      this.updateDisplay();
    }
  }

  private scheduleAlarm(): void {
    const endsAt = new Date(Date.now() + this.remaining() * 1000).toISOString();
    this.pomodoroService.scheduleAlarm(this.sessionTypeMap[this.phase()], endsAt);
  }

  private cancelAlarm(): void {
    this.pomodoroService.cancelAlarm();
  }

  private persist(): void {
    const state: PomodoroState = {
      phase: this.phase(),
      startedAt: new Date().toISOString(),
      pausedRemaining: this.isRunning() ? null : this.remaining(),
      workSessionsCompleted: this.workSessionsCompleted(),
    };
    this.storage.saveState(state);
  }

  private persistSettings(): void {
    const settings: PomodoroSettings = {
      workTime: this.workTime(),
      restTime: this.restTime(),
      bigRestTime: this.bigRestTime(),
      workSessionsBeforeBigRest: this.workSessionsBeforeBigRest(),
    };
    this.storage.saveSettings(settings);
  }

  startNext() {
    this.remaining.set(this.phaseDuration());
    this.updateDisplay();
    this.startTimer();
    this.persist();
  }

  togglePause() {
    if (this.isRunning()) {
      this.stopTimer();
    } else {
      this.startTimer();
    }
    this.persist();
  }

  reset() {
    this.stopTimer();
    this.phase.set('work');
    this.workSessionsCompleted.set(0);
    this.remaining.set(this.workTimeInSeconds());
    this.updateDisplay();
    this.storage.clearState();
  }

  private startTimer() {
    this.isRunning.set(true);
    this.scheduleAlarm();
    this.intervalId = setInterval(() => {
      const next = this.remaining() - 1;
      if (next <= 0) {
        this.remaining.set(0);
        this.updateDisplay();
        this.onSessionComplete();
        return;
      }
      this.remaining.set(next);
      this.updateDisplay();
    }, 1000);
  }

  private stopTimer() {
    this.isRunning.set(false);
    this.cancelAlarm();
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private isBigRestEnabled(): boolean {
    return this.bigRestTime() > 0;
  }

  private onSessionComplete() {
    this.stopTimer();
    const currentPhase = this.phase();
    if (currentPhase === 'work') {
      this.workSessionsCompleted.update(c => c + 1);
      if (this.isBigRestEnabled() && this.workSessionsCompleted() >= this.workSessionsBeforeBigRest()) {
        this.phase.set('big-rest');
      } else {
        this.phase.set('rest');
      }
    } else {
      if (currentPhase === 'big-rest') {
        this.workSessionsCompleted.set(0);
      }
      this.phase.set('work');
    }
    this.remaining.set(this.phaseDuration());
    this.updateDisplay();
  }

  private updateDisplay() {
    this.displayTime.set(this.formatTime(this.remaining()));
    this.progress.set((this.remaining() / this.phaseDuration()) * 100);
  }

  private formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  private syncRemainingIfIdle() {
    if (!this.isRunning()) {
      this.remaining.set(this.phaseDuration());
      this.updateDisplay();
    }
  }

  onWorkTimeChange(value: string) {
    const v = value.trim() !== '' ? parseInt(value, 10) : 25;
    if (v > 0) { this.workTime.set(v); this.syncRemainingIfIdle(); this.persistSettings(); }
  }

  onRestTimeChange(value: string) {
    const v = value.trim() !== '' ? parseInt(value, 10) : 5;
    if (v > 0) { this.restTime.set(v); this.syncRemainingIfIdle(); this.persistSettings(); }
  }

  onBigRestTimeChange(value: string) {
    const v = value.trim() === '' ? 0 : parseInt(value, 10);
    this.bigRestTime.set(v < 0 ? 0 : v);
    if (this.bigRestTime() === 0 && this.phase() === 'big-rest') {
      this.phase.set('work');
      this.workSessionsCompleted.set(0);
    }
    this.syncRemainingIfIdle();
    this.persistSettings();
  }

  onWorkSessionsChange(value: string) {
    const v = parseInt(value, 10);
    if (v > 0) { this.workSessionsBeforeBigRest.set(v); this.persistSettings(); }
  }

  ngOnDestroy() {
    this.stopTimer();
  }
}
