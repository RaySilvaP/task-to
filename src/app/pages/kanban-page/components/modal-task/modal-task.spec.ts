import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTask } from './modal-task';

describe('ModalTask', () => {
  let component: ModalTask;
  let fixture: ComponentFixture<ModalTask>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalTask]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalTask);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
