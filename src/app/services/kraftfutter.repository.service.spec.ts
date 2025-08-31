import { TestBed } from '@angular/core/testing';

import { KraftfutterRepositoryService } from './kraftfutter.repository.service';

describe('KraftfutterRepositoryService', () => {
  let service: KraftfutterRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KraftfutterRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
