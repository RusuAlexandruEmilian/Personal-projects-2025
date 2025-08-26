import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserReviewCardComponent } from './user-review-card.component';

describe('UserReviewCardComponent', () => {
  let component: UserReviewCardComponent;
  let fixture: ComponentFixture<UserReviewCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserReviewCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserReviewCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
