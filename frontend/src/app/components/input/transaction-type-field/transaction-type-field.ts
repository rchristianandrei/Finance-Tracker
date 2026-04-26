import { Component, effect, forwardRef, input, signal } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { TransactionType } from '@app/types/category';

@Component({
  selector: 'app-transaction-type-field',
  imports: [MatRadioModule, ReactiveFormsModule, MatSelectModule],
  templateUrl: './transaction-type-field.html',
  styleUrl: './transaction-type-field.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TransactionTypeField),
      multi: true,
    },
  ],
})
export class TransactionTypeField implements ControlValueAccessor {
  formControl = input.required<FormControl<TransactionType | null>>();

  readonly value = signal<TransactionType>(1);
  readonly disabled = signal(false);

  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.value.set(value);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
