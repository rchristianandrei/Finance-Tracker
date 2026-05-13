import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTransaction } from './update-transaction';

describe('UpdateTransaction', () => {
  let component: UpdateTransaction;
  let fixture: ComponentFixture<UpdateTransaction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateTransaction],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateTransaction);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
