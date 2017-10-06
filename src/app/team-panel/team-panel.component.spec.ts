import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamPanelComponent } from './team-panel.component';

describe('TeamPanelComponent', () => {
  let component: TeamPanelComponent;
  let fixture: ComponentFixture<TeamPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
