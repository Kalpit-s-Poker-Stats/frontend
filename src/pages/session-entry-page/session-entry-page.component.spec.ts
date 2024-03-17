import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionEntryPageComponent } from './session-entry-page.component';

describe('SessionEntryPageComponent', () => {
  let component: SessionEntryPageComponent;
  let fixture: ComponentFixture<SessionEntryPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SessionEntryPageComponent]
    });
    fixture = TestBed.createComponent(SessionEntryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
