import { TestBed } from '@angular/core/testing';

import { FeedRepositoryService } from './feed.repository.service';

describe('FeedRepositoryService', () => {
  let service: FeedRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeedRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
