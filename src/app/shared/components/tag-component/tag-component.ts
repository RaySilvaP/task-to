import { Component, input } from '@angular/core';
import Tag from '../../../models/tag';

@Component({
  selector: 'app-tag-component',
  imports: [],
  templateUrl: './tag-component.html',
  styleUrl: './tag-component.css',
})
export class TagComponent {
  tag = input.required<Tag>();
}
