import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTransaction } from './delete-transaction';

describe('DeleteTransaction', () => {
  let component: DeleteTransaction;
  let fixture: ComponentFixture<DeleteTransaction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteTransaction],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteTransaction);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
