import { Component, computed, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import Task from '../../../models/task';
import { TagComponent } from "../tag-component/tag-component";
import { TagService } from '../../../services/tag-service';

@Component({
  selector: 'app-task-card',
  imports: [DatePipe, TagComponent],
  templateUrl: './task-card.html',
  styleUrl: './task-card.css',
})
export class TaskCard {
  private readonly tagService = inject(TagService);
  protected tag = computed(() => {
    const tags = this.tagService.tags();
    return tags.find(t => t.id === this.task().tag_id);
  })
  public task = input.required<Task>();

  protected priorityClass(priority: string | undefined): string {
    switch (priority) {
      case 'Low': return 'priority-low';
      case 'Medium': return 'priority-medium';
      case 'High': return 'priority-high';
      default: return '';
    }
  }
}
