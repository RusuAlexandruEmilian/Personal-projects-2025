import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewFormStarRatingComponent } from './review-form-star-rating.component';

describe('ReviewFormStarRatingComponent', () => {
  let component: ReviewFormStarRatingComponent;
  let fixture: ComponentFixture<ReviewFormStarRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewFormStarRatingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewFormStarRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
