import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalContext } from './modal-context';

describe('ModalContext', () => {
  let component: ModalContext;
  let fixture: ComponentFixture<ModalContext>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalContext]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalContext);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
