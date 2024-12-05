import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteSupervisorComponent } from './site-supervisor.component';

describe('SiteSupervisorComponent', () => {
  let component: SiteSupervisorComponent;
  let fixture: ComponentFixture<SiteSupervisorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteSupervisorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SiteSupervisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
