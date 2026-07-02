import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanTaskCard } from './kanban-task-card';

describe('KanbanTaskCard', () => {
  let component: KanbanTaskCard;
  let fixture: ComponentFixture<KanbanTaskCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KanbanTaskCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KanbanTaskCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
