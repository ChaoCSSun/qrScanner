import { TestBed } from '@angular/core/testing';

import { ScanCodeService } from './scan-code.service';

describe('ScanCodeService', () => {
  let service: ScanCodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScanCodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
