import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Cabin } from '../../core/models/cabin';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { ReserveFormComponent } from '../../shared/reserve-form/reserve-form.component';
import { CabinStarRatingComponent } from '../../shared/cabin-star-rating/cabin-star-rating.component';
import { UserReviewCardComponent } from '../../shared/user-review-card/user-review-card.component';
import { Review } from '../../core/models/review';
import { CabinImageGalleryComponent } from '../../shared/cabin-image-gallery/cabin-image-gallery.component';
import { ReviewFormComponent } from '../../shared/review-form/review-form.component';





@Component({
  selector: 'app-cabin-details',
  standalone: true,
  imports: [RouterModule, CommonModule, ReserveFormComponent, CabinStarRatingComponent, UserReviewCardComponent, CabinImageGalleryComponent],
  templateUrl: './cabin-details.component.html',
  styleUrl: './cabin-details.component.scss'
})
export class CabinDetailsComponent implements OnInit{
  cabinId!: number; 
  cabin$!: Observable<Cabin[]>;
  private dialog = inject(Dialog);
  dataForReserveForm: any;
  isNoDatesWarning!: boolean;
  reviews$!: Observable<Review[]>;
  numberOfReviews: number = 0;
 
  
  
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private http: HttpClient){
    this.cabinId = this.router.getCurrentNavigation()?.extras?.state?.['data'][0];
    this.dataForReserveForm = this.router.getCurrentNavigation()?.extras?.state?.['data'];
  }
 
  ngOnInit(){
    this.getCabinById();
    this.isNoDatesWarning = false;
    this.getReviews();
  }
  
  
  getCabinById(){
    this.cabin$ = this.http.get<Cabin[]>(`http://localhost:3000/search/cabinId?cabin_id=${this.cabinId}`);
  }

  protected openReserveForm(){
    if(this.dataForReserveForm[1] && this.dataForReserveForm[2]){
      this.cabin$.subscribe(cabin => {
        if(cabin){
          this.dialog.open(ReserveFormComponent, { autoFocus: false, disableClose: true, data: [cabin[0], this.dataForReserveForm] });
        }
        
      })
    }else{
      this.isNoDatesWarning = true;
    }
    
    
  };

  getReviews(){
    this.reviews$ = this.http.get<Review[]>(`http://localhost:3000/cabin/reviews?cabin_id=${this.cabinId}`);
    this.reviews$.subscribe(data => {
      this.numberOfReviews = data.length;
    })
  }
  
  protected openImageGallery(){
    this.cabin$.subscribe(data => {
      this.dialog.open(CabinImageGalleryComponent, { autoFocus: false, disableClose: true, data: data[0].picture});
    })
    
  };

  protected openReviewForm(){

    this.cabin$.subscribe(cabinDetails => {
      this.dialog.open(ReviewFormComponent, { autoFocus: false, disableClose: true, data: cabinDetails});
    })
    
    this.dialog.afterAllClosed.subscribe(() => {
      this.getReviews();
    });
  }
  
  

}
