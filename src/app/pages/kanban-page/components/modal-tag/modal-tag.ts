import { Component, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Modal } from '../../../../shared/components/modal/modal';
import { ModalFooter } from '../../../../shared/components/modal-footer/modal-footer';
import { Button } from '../../../../shared/components/button/button';
import { InputField } from '../../../../shared/components/input-field/input-field';
import Tag from '../../../../models/tag';
import { TagComponent } from "../../../../shared/components/tag-component/tag-component";
import { TagService } from '../../../../services/tag-service';
import { ModalPrompt } from '../../../../shared/components/modal-prompt/modal-prompt';

@Component({
  selector: 'app-modal-tag',
  imports: [Modal, ModalFooter, Button, ReactiveFormsModule, InputField, TagComponent, ModalPrompt],
  templateUrl: './modal-tag.html',
  styleUrl: './modal-tag.css',
})
export class ModalTag implements OnInit {
  private readonly tagService = inject(TagService);
  private fb = inject(FormBuilder);
  protected tagForm: FormGroup;
  protected colors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308',
    '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6',
    '#6366f1', '#a855f7', '#d946ef', '#ec4899',
  ];
  protected tags = this.tagService.tags;
  protected selectedTag: Tag | null = null;
  protected showPromptModal = signal<boolean>(false);
  tag = input<Tag>();
  close = output();
  submit = output<Tag>();
  delete = output<number>();

  constructor() {
    this.tagForm = this.fb.group({
      name: ['', Validators.required],
      color: ['#3b82f6', Validators.required],
    });

    effect(() => {
      console.log(this.tag());
    })
  }

  async ngOnInit(): Promise<void> {
    if (this.tag()) {
      this.tagForm.patchValue({
        name: this.tag()!.name ?? '',
        color: this.tag()!.color ?? '#3b82f6',
      }, { emitEvent: false });

      this.selectedTag = this.tag()!;
    }

    this.tagForm.get('name')?.valueChanges.subscribe(name => {
      const match = this.tags().find(t => t.name === name);
      if (match) {
        this.selectedTag = match;
        this.tagForm.patchValue({ color: match.color }, { emitEvent: false });
      } else {
        this.selectedTag = null;
      }
    });
  }

  protected filteredTags(): Tag[] {
    const name = this.tagForm.get('name')?.value?.toLowerCase() ?? '';
    if (!name) return this.tags();
    return this.tags().filter(t => t.name.toLowerCase().includes(name));
  }

  protected selectColor(color: string) {
    this.tagForm.patchValue({ color });
  }

  protected selectTag(tag: Tag) {
    this.selectedTag = tag;
    this.tagForm.patchValue({ name: tag.name, color: tag.color });
  }

  protected onSubmit() {
    if (this.tagForm.invalid) return;

    const { name, color } = this.tagForm.value;

    const result = {
      id: this.selectedTag?.id ?? -1,
      name: this.selectedTag?.name ?? name,
      color,
    } as Tag;

    this.submit.emit(result);
  }

  protected onDelete() {
    this.delete.emit(this.selectedTag?.id ?? this.tag()!.id);
    this.tagForm.reset();
    this.showPromptModal.set(false);
  }
}
