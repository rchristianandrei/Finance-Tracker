import { TestBed } from '@angular/core/testing';

import { SaveCategoryService } from './add-category-service';

describe('AddCategoryService', () => {
  let service: SaveCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
