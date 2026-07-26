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
import { TagService } from '../../../../services/tag-service';

@Component({
  selector: 'app-modal-task',
  imports: [Modal, ModalFooter, Button, ReactiveFormsModule, InputField, Select, ModalTag, TagComponent],
  templateUrl: './modal-task.html',
  styleUrl: './modal-task.css',
})
export class ModalTask implements OnInit {
  private readonly tagService = inject(TagService);
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

    if (this.task()) {
      const tags = this.tagService.tags();
      this.selectedTag.set(tags.find(t => t.id === this.task()!.tag_id) ?? null);
    }
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
      tag_id: this.selectedTag()?.id
    } as Task;

    this.submit.emit(task);
  }

  protected onDelete() {
    this.delete.emit(this.task()!.id);
  }

  protected async onSelectTag(tag: Tag) {
    if (tag.id > 0) {
      await this.tagService.edit(tag);
      this.selectedTag.set(tag);
    }
    else {
      tag.id = await this.tagService.add(tag);
      this.selectedTag.set(tag);
    }

    await this.tagService.load();
    this.showTagModal.set(false);
  }

  protected async onDeleteTag(tagId: number) {
    await this.tagService.delete(tagId);
    await this.tagService.load();
    this.selectedTag.set(null);
  }
}
