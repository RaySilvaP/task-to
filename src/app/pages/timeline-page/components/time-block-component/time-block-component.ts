import { Component, input } from '@angular/core';
import TimeBlock from '../../../../models/timeBlock';

@Component({
  selector: 'app-time-block-component',
  imports: [],
  templateUrl: './time-block-component.html',
  styleUrl: './time-block-component.css',
})
export class TimeBlockComponent {
  public timeBlock = input.required<TimeBlock>();
}
