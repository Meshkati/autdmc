import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PastCompetitionComponent } from './past-competition.component';

describe('PastCompetitionComponent', () => {
  let component: PastCompetitionComponent;
  let fixture: ComponentFixture<PastCompetitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PastCompetitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PastCompetitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
