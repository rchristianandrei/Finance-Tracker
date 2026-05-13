import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTransactionForm } from './add-transaction-form';

describe('AddExpense', () => {
  let component: AddTransactionForm;
  let fixture: ComponentFixture<AddTransactionForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTransactionForm],
    }).compileComponents();

    fixture = TestBed.createComponent(AddTransactionForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
