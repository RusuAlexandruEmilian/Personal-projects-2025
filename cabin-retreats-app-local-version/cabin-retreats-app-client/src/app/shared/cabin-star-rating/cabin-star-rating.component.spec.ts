import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabinStarRatingComponent } from './cabin-star-rating.component';

describe('CabinStarRatingComponent', () => {
  let component: CabinStarRatingComponent;
  let fixture: ComponentFixture<CabinStarRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CabinStarRatingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CabinStarRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
