import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import TimeBlock from '../../../../models/timeBlock';
import { Modal } from "../../../../shared/components/modal/modal";
import { InputField } from "../../../../shared/components/input-field/input-field";
import { ModalFooter } from "../../../../shared/components/modal-footer/modal-footer";
import { Button } from "../../../../shared/components/button/button";
import { TaskService } from '../../../../services/task-service';
import Task from '../../../../models/task';
import { TaskCard } from '../../../../shared/components/task-card/task-card';
import { StatisticsService } from '../../../../services/statistics-service';

@Component({
  selector: 'app-modal-time-block',
  imports: [Modal, InputField, ModalFooter, Button, ReactiveFormsModule, TaskCard],
  templateUrl: './modal-time-block.html',
  styleUrl: './modal-time-block.css',
})
export class ModalTimeBlock implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly statisticsService = inject(StatisticsService);
  private fb = inject(FormBuilder);
  protected timeBlockForm: FormGroup;
  protected showTaskModal = signal<boolean>(false);
  protected tasks = signal<Task[]>([]);
  protected selectedTask?: Task;
  protected averageBlockDuration = this.statisticsService.averageBlockDuration;
  public type = input<'edit' | 'create'>('create');
  public timeBlock = input<TimeBlock>();
  public timelineDate = input<Date>();
  public close = output();
  public submit = output<TimeBlock>();
  public delete = output<number>();

  protected averageBlockDurationDisplay = computed(() => {
    const minutes = this.averageBlockDuration();
    if (minutes >= 60) {
      const hours = minutes / 60;
      return `${hours.toFixed(1)} hours`;
    }
    return `${minutes.toFixed()} minutes`;
  });

  constructor() {
    this.timeBlockForm = this.fb.group({
      name: ['', Validators.required],
      date: [this.formatDate(new Date()), Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required]
    });
  }

  async ngOnInit(): Promise<void> {
    const block = this.timeBlock();
    const timelineDate = this.timelineDate();
    if (block) {
      const startDate = new Date(block.start_date_time);
      const endDate = new Date(startDate.getTime() + block.duration * 60000);

      this.timeBlockForm.patchValue(
        {
          name: block.name,
          date: this.formatDate(startDate),
          start: this.formatTime(startDate),
          end: this.formatTime(endDate),
        },
        { emitEvent: false }
      );
    }
    else if (timelineDate) {
      this.timeBlockForm.patchValue(
        {
          date: this.formatDate(timelineDate),
        },
        { emitEvent: false }
      );
    }

    this.tasks.set(await this.taskService.get());
    console.log(this.tasks());
    if (block?.task_id)
      this.selectedTask = this.tasks().find(t => t.id === block.task_id);

  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private formatTime(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  protected onSubmitForm() {
    if (this.timeBlockForm.invalid)
      return;

    const { name, date, start, end } = this.timeBlockForm.value;
    this.timeBlockForm.reset();

    const startDate = new Date(`${date}T${start}`);
    const endDate = new Date(`${date}T${end}`);
    const duration = (endDate.getTime() - startDate.getTime()) / 60000;

    const task = {
      id: this.timeBlock()?.id ?? -1,
      name,
      start_date_time: startDate.toISOString(),
      task_id: this.selectedTask?.id,
      duration,
      overlap_order: this.timeBlock()?.overlap_order ?? 1
    } as TimeBlock;

    this.submit.emit(task);
  }

  protected onDelete() {
    this.delete.emit(this.timeBlock()!.id);
  }

  protected onSelectTask(task: Task) {
    this.selectedTask = task;
    this.showTaskModal.set(false);
  }

  protected async onChangeFilter(filter: string) {
    this.tasks.set(await this.taskService.get(filter, filter));
  }
}
