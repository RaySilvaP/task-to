import { TestBed } from '@angular/core/testing';

import { KanbanColumnService } from './kanban-column-service';

describe('KanbanColumnService', () => {
  let service: KanbanColumnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KanbanColumnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
