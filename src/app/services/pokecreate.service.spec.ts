import { TestBed } from '@angular/core/testing';

import { PokecreateService } from './pokecreate.service';

describe('PokecreateService', () => {
  let service: PokecreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PokecreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
