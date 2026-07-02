import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanActionButton } from './kanban-action-button';

describe('KanbanActionButton', () => {
  let component: KanbanActionButton;
  let fixture: ComponentFixture<KanbanActionButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KanbanActionButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KanbanActionButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
