import { TestBed } from '@angular/core/testing';

import { HorseRepositoryService } from './horse.repository.service';

describe('HorseRepositoryService', () => {
  let service: HorseRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HorseRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
