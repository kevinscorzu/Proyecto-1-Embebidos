import { TestBed } from '@angular/core/testing';

import { ServerConectionService } from './server-conection.service';

describe('ServerConectionService', () => {
  let service: ServerConectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServerConectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
