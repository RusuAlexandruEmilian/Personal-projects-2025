import { Component, Input } from '@angular/core';
import { Cabin } from '../../core/models/cabin';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cabin-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cabin-card.component.html',
  styleUrl: './cabin-card.component.scss'
})
export class CabinCardComponent {
  @Input() cabin!: Cabin;
  @Input() guests_and_number_of_nights!: string | null;
  @Input() numberOfNights!: number | null;
  @Input() check_in!: string | null;
  @Input() check_out!: string | null;

  cabinName!: String ;
  totalPrice!: number;
  
  
  ngOnInit(){
    this.cabinName = this.cabin.name;
    this.cabinName = this.cabinName.split(' ').join('-');

    if(this.cabin.price_per_night){
      this.totalPrice = parseFloat((this.numberOfNights! * this.cabin.price_per_night).toFixed(2));
    }
    
    
  }
  
}
