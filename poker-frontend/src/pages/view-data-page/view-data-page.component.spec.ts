import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDataPageComponent } from './view-data-page.component';

describe('ViewDataPageComponent', () => {
  let component: ViewDataPageComponent;
  let fixture: ComponentFixture<ViewDataPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewDataPageComponent]
    });
    fixture = TestBed.createComponent(ViewDataPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
