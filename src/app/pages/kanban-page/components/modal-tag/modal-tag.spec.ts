import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTag } from './modal-tag';

describe('ModalTag', () => {
  let component: ModalTag;
  let fixture: ComponentFixture<ModalTag>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalTag]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalTag);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
