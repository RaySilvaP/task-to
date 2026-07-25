import { Component, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { Modal } from '../../../../shared/components/modal/modal';
import { ModalFooter } from '../../../../shared/components/modal-footer/modal-footer';
import { Button } from "../../../../shared/components/button/button";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputField } from "../../../../shared/components/input-field/input-field";
import Task, { TaskPriority } from '../../../../models/task';
import { Select } from '../../../../shared/components/select/select';
import { ModalTag } from "../modal-tag/modal-tag";
import Tag from '../../../../models/tag';
import { TagComponent } from "../../../../shared/components/tag-component/tag-component";

@Component({
  selector: 'app-modal-task',
  imports: [Modal, ModalFooter, Button, ReactiveFormsModule, InputField, Select, ModalTag, TagComponent],
  templateUrl: './modal-task.html',
  styleUrl: './modal-task.css',
})
export class ModalTask implements OnInit {
  private fb = inject(FormBuilder);
  protected taskForm: FormGroup;
  protected priorityOptions = Object.entries(TaskPriority)
    .filter(([key]) => isNaN(Number(key)))
    .map(([key, value]) => ({ key, value: value as TaskPriority }));
  protected showTagModal = signal<boolean>(false);
  protected selectedTag = signal<Tag | null>(null);
  public type = input<'edit' | 'create'>('create');
  public task = input<Task>();
  public close = output();
  public submit = output<Task>();
  public delete = output<number>();

  constructor() {
    this.taskForm = this.fb.group({
      name: ['', Validators.required],
      due: [],
      priority: []
    });
    effect(() => {
      console.log(this.selectedTag())
    })
  }

  ngOnInit(): void {
    this.taskForm.patchValue(
      {
        name: this.task()?.name ?? '',
        due: this.task()?.due,
        priority: this.task()?.priority ?? null,
      },
      { emitEvent: false }
    );
  }

  protected onSubmitForm() {
    if (this.taskForm.invalid)
      return;

    const { name, due, priority } = this.taskForm.value;
    this.taskForm.reset();

    const task = {
      id: this.task()?.id ?? -1,
      name,
      due,
      priority: priority === '' ? undefined : priority,
      kanban_column_id: this.task()?.kanban_column_id ?? -1,
      position: this.task()?.position ?? 1,
    } as Task;

    this.submit.emit(task);
  }

  protected onDelete() {
    this.delete.emit(this.task()!.id);
  }
}
