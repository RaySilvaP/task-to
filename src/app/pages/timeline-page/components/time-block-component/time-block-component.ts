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
}
