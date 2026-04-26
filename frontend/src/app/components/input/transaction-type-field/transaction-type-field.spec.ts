import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionTypeField } from './transaction-type-field';

describe('TransactionTypeField', () => {
  let component: TransactionTypeField;
  let fixture: ComponentFixture<TransactionTypeField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionTypeField],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionTypeField);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
