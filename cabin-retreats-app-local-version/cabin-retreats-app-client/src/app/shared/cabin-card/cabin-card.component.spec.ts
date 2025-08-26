import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabinCardComponent } from './cabin-card.component';

describe('CabinCardComponent', () => {
  let component: CabinCardComponent;
  let fixture: ComponentFixture<CabinCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CabinCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CabinCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
