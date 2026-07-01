import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanPage } from './kanban-page';

describe('KanbanPage', () => {
  let component: KanbanPage;
  let fixture: ComponentFixture<KanbanPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KanbanPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KanbanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
