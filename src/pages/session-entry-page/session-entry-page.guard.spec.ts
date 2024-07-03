import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { sessionEntryPageGuard } from './session-entry-page.guard';

describe('sessionEntryPageGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => sessionEntryPageGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
