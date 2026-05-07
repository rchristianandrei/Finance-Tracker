import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveUser } from './save-user';

describe('SaveUser', () => {
  let component: SaveUser;
  let fixture: ComponentFixture<SaveUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaveUser],
    }).compileComponents();

    fixture = TestBed.createComponent(SaveUser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
