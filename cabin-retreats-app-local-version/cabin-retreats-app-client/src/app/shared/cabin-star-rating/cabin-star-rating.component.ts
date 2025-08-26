import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cabin-star-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cabin-star-rating.component.html',
  styleUrl: './cabin-star-rating.component.scss'
})
export class CabinStarRatingComponent {
  @Input() rating!: number;
  @Input() starStyle: {[key: string]: string} = {};
  @Input() starContainerStyle: {[key: string]: string} = {};

 setRating(value: number){
  this.rating = value;
 
 }

 setStarStyle(index: number): { [key: string]: string }{
    if(index <= Math.floor(this.rating)){
      return {'color': 'gold'}
    }else{
      const percent = Math.round((this.rating - Math.floor(this.rating)) * 100);
      return {
        background: `linear-gradient(to right, gold 0%, gold ${percent}%, grey ${percent}%, grey 100%)`,
        '-webkit-background-clip': 'text',
        '-webkit-text-fill-color': 'transparent',
       
      };
    
    }
 }


 getCombinedStyles(index: number) {
  return { ...this.setStarStyle(index), ...this.starStyle };
}
}
