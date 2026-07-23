import { Component, input } from '@angular/core';
import TimeBlock from '../../../../models/timeBlock';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-time-block-component',
  imports: [ReactiveFormsModule],
  templateUrl: './time-block-component.html',
  styleUrl: './time-block-component.css',
})
export class TimeBlockComponent {
  public timeBlock = input.required<TimeBlock>();

  protected timeRange(): string {
    const block = this.timeBlock();
    const start = new Date(block.start_date_time);
    const end = new Date(start.getTime() + block.duration * 60_000);
    return `${formatTime(start)} - ${formatTime(end)}`;
  };
}

function formatTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}
