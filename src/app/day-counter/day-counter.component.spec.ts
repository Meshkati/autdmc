import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayCounterComponent } from './day-counter.component';

describe('DayCounterComponent', () => {
  let component: DayCounterComponent;
  let fixture: ComponentFixture<DayCounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayCounterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
