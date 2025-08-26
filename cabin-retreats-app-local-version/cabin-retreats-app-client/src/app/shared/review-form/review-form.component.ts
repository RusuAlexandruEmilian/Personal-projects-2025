import { Component, ElementRef, EventEmitter, Inject, Output, ViewChild } from '@angular/core';
import { ReviewFormStarRatingComponent } from '../review-form-star-rating/review-form-star-rating.component';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [ReviewFormStarRatingComponent, ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './review-form.component.html',
  styleUrl: './review-form.component.scss'
})
export class ReviewFormComponent {

  

  @ViewChild('reviewFormContainer') reviewFormContainer!: ElementRef;

  constructor(@Inject(DIALOG_DATA) public data: any, private dialogRef: DialogRef, private http: HttpClient){
   
  }

  rating!: number;
  showReviewForm:boolean = true;
  showInputWarning:string = '';
  showWrongLoginDetailsWarning: boolean = false;
  showSubmitMessage: boolean = false;
  submitMessageImg!: string;
  submitMessage!: string;
  submitMessageRed: boolean = false;

  reviewForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    review: new FormControl('')
  })

  closeModal(){
    this.dialogRef.close();
  }

  createReview(){
    if(this.showWrongLoginDetailsWarning){
      this.reviewFormContainer.nativeElement.scrollTop = 0;
    }

    if(!this.reviewForm.value.email){
      this.showInputWarning = 'email';
      this.reviewFormContainer.nativeElement.scrollTop = 0; 
    }else if(!this.reviewForm.value.password){
      this.showInputWarning = 'password';
      this.reviewFormContainer.nativeElement.scrollTop = 0; 
    }else{
      this.http.post<{message: string}>('http://localhost:3000/create/review', {
        email: this.reviewForm.value.email, 
        password: this.reviewForm.value.password,
        cabin_id: this.data[0].id,
        review: this.reviewForm.value.review, 
        rating: this.rating }).subscribe(message => {
          if(message.message ===  "Wrong email or password"){
            this.showWrongLoginDetailsWarning = true;
            this.reviewFormContainer.nativeElement.scrollTop = 0; 
            this.showInputWarning = '';
          }else if(message.message === "Review created successfully"){
            this.showSubmitMessage = true;
            this.showReviewForm = false;
            this.submitMessage = "Review created. Thank you for your feedback !";
            this.submitMessageImg = "assets/icons/check.png"
          }else if(message.message === "Booking not found"){
            this.showSubmitMessage = true;
            this.showReviewForm = false;
            this.submitMessage = "You haven't made a booking for this location";
            this.submitMessageImg = "assets/icons/exclamation.png";
            this.submitMessageRed = true;
          }else{
            this.showSubmitMessage = true;
            this.showReviewForm = false;
            this.submitMessage = "You have already reviewed this location";
            this.submitMessageImg = "assets/icons/exclamation.png";
          }
        });
    }
    
  }
}
