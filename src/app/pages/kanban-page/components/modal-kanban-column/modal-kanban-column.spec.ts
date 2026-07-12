import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalKanbanColumn } from './modal-kanban-column';

describe('ModalKanbanColumn', () => {
  let component: ModalKanbanColumn;
  let fixture: ComponentFixture<ModalKanbanColumn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalKanbanColumn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalKanbanColumn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
