import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotsComponent } from './slots.component';

describe('SlotsComponent', () => {
  let component: SlotsComponent;
  let fixture: ComponentFixture<SlotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlotsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
