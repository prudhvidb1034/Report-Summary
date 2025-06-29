import { TestBed } from '@angular/core/testing';

import { GemeniAiService } from './gemeni-ai.service';

describe('GemeniAiService', () => {
  let service: GemeniAiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GemeniAiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
