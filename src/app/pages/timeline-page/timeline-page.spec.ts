import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelinePage } from './timeline-page';

describe('TimelinePage', () => {
  let component: TimelinePage;
  let fixture: ComponentFixture<TimelinePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelinePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimelinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
