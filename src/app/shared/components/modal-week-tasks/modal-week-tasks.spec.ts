import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalWeekTasks } from './modal-week-tasks';

describe('ModalWeekTasks', () => {
  let component: ModalWeekTasks;
  let fixture: ComponentFixture<ModalWeekTasks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalWeekTasks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalWeekTasks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
