import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'app-review-form-star-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-form-star-rating.component.html',
  styleUrl: './review-form-star-rating.component.scss'
})
export class ReviewFormStarRatingComponent {

  @Output() sendRating = new EventEmitter<number>();
  rating: number = 1;

  sendRatingToForm(value: number){
    this.rating = value;
    this.sendRating.emit(this.rating);
  }
}
