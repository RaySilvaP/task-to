import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPrompt } from './modal-prompt';

describe('ModalPrompt', () => {
  let component: ModalPrompt;
  let fixture: ComponentFixture<ModalPrompt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalPrompt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalPrompt);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
