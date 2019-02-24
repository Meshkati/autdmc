import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicScoreboardComponent } from './public-scoreboard.component';

describe('PublicScoreboardComponent', () => {
  let component: PublicScoreboardComponent;
  let fixture: ComponentFixture<PublicScoreboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicScoreboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicScoreboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
