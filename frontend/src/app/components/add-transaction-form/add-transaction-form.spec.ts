import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExpenseForm } from './add-transaction-form';

describe('AddExpense', () => {
  let component: AddExpenseForm;
  let fixture: ComponentFixture<AddExpenseForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddExpenseForm],
    }).compileComponents();

    fixture = TestBed.createComponent(AddExpenseForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
