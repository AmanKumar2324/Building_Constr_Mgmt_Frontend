import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustonMessageAlertComponent } from './custon-message-alert.component';

describe('CustonMessageAlertComponent', () => {
  let component: CustonMessageAlertComponent;
  let fixture: ComponentFixture<CustonMessageAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustonMessageAlertComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustonMessageAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
