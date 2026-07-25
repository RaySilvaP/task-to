import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Modal } from '../../../../shared/components/modal/modal';
import { ModalFooter } from '../../../../shared/components/modal-footer/modal-footer';
import { Button } from '../../../../shared/components/button/button';
import { InputField } from '../../../../shared/components/input-field/input-field';
import Tag from '../../../../models/tag';
import { TagComponent } from "../../../../shared/components/tag-component/tag-component";

@Component({
  selector: 'app-modal-tag',
  imports: [Modal, ModalFooter, Button, ReactiveFormsModule, InputField, TagComponent],
  templateUrl: './modal-tag.html',
  styleUrl: './modal-tag.css',
})
export class ModalTag implements OnInit {
  private fb = inject(FormBuilder);
  protected tagForm: FormGroup;
  protected colors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308',
    '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6',
    '#6366f1', '#a855f7', '#d946ef', '#ec4899',
  ];
  protected mockTags: Tag[] = [
    { id: 1, name: 'backend', color: '#ef4444' },
    { id: 2, name: 'frontend', color: '#3b82f6' },
    { id: 3, name: 'infra', color: '#22c55e' },
    { id: 4, name: 'design', color: '#a855f7' },
    { id: 5, name: 'bug', color: '#f59e0b' },
  ];
  protected selectedMock: Tag | null = null;
  type = input<'create' | 'edit'>('create');
  tag = input<Tag>();
  close = output();
  submit = output<Tag>();
  delete = output<number>();

  constructor() {
    this.tagForm = this.fb.group({
      name: ['', Validators.required],
      color: ['#3b82f6', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.type() === 'edit') {
      this.tagForm.patchValue({
        name: this.tag()?.name ?? '',
        color: this.tag()?.color ?? '#3b82f6',
      }, { emitEvent: false });
    }

    this.tagForm.get('name')?.valueChanges.subscribe(name => {
      const match = this.mockTags.find(t => t.name === name);
      if (match) {
        this.selectedMock = match;
        this.tagForm.patchValue({ color: match.color }, { emitEvent: false });
      } else {
        this.selectedMock = null;
      }
    });
  }

  protected filteredTags(): Tag[] {
    const name = this.tagForm.get('name')?.value?.toLowerCase() ?? '';
    if (!name) return this.mockTags;
    return this.mockTags.filter(t => t.name.toLowerCase().includes(name));
  }

  protected selectColor(color: string) {
    this.tagForm.patchValue({ color });
  }

  protected selectTag(tag: Tag) {
    this.selectedMock = tag;
    this.tagForm.patchValue({ name: tag.name, color: tag.color });
  }

  protected onSubmit() {
    if (this.tagForm.invalid) return;

    const { name, color } = this.tagForm.value;

    const result = {
      id: this.selectedMock?.id ?? -1,
      name: this.selectedMock?.name ?? name,
      color,
    } as Tag;

    this.submit.emit(result);
  }

  protected onDelete() {
    this.delete.emit(this.selectedMock?.id ?? this.tag()!.id);
  }
}
