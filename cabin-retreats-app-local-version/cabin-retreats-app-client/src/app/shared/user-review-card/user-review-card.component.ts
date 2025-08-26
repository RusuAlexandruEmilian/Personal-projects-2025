import { Component, inject, Input, OnInit } from '@angular/core';
import { CabinStarRatingComponent } from '../cabin-star-rating/cabin-star-rating.component';
import { Review } from '../../core/models/review';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-user-review-card',
  standalone: true,
  imports: [CabinStarRatingComponent],
  templateUrl: './user-review-card.component.html',
  styleUrl: './user-review-card.component.scss'
})
export class UserReviewCardComponent implements OnInit{
  private http = inject(HttpClient);
  @Input() review!: Review;
  userName!: string;
  reviewDate!: string;

  ngOnInit(): void {
    this.getUserName();
    this.reviewDate = formatDate(this.review.created_at, 'dd MMM yyyy', 'en-us'); 
      
  }

  getUserName(){
    this.http.get<[{name: string}]>(`http://localhost:3000/search/user/name?user_id=${this.review.user_id}`).subscribe(name => {
      this.userName = name[0].name;
    })
  }
}
