import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTimeBlock } from './modal-time-block';

describe('ModalTimeBlock', () => {
  let component: ModalTimeBlock;
  let fixture: ComponentFixture<ModalTimeBlock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalTimeBlock]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalTimeBlock);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
