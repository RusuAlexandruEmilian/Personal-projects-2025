import { Component, OnDestroy } from '@angular/core';
import { Cabin } from '../../core/models/cabin';
import { Observable, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CabinCardComponent } from '../../shared/cabin-card/cabin-card.component';
import { AsyncPipe } from '@angular/common';
import { searchAvailableCabinsEvent } from '../../shared/search-available-cabins-form/search-available-cabins-form.component';
import { HeaderService } from '../../core/services/header.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CabinCardComponent, AsyncPipe, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent {

  private url = 'http://localhost:3000'
  cabins$!: Observable<Cabin[]>; 
  private subscription!: Subscription;
  guests: string | null = '';
  numberOfNights!: number | null; 
  check_in!: string | null;
  check_out!: string | null;
  
  
  

  constructor(private http: HttpClient, private searchEvent: searchAvailableCabinsEvent, private headerService: HeaderService, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.subscription = this.searchEvent.events.subscribe(
      (eventData) => {
        if (eventData) {
          this.getAvailableCabins(eventData);
          this.check_in = eventData[0];
          this.check_out = eventData[1];
          const adultsNumber = parseInt(eventData[4]);
          const childrenNumber = parseInt(eventData[5]);
          const checkIn = new Date(eventData[0]);
          const checkOut = new Date(eventData[1]);
          // Get the difference in milliseconds
          const diffInMs = checkOut.getTime() - checkIn.getTime();

          // Convert milliseconds to days
          const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
          
          this.numberOfNights = diffInDays;

          if(adultsNumber > 0 && childrenNumber > 0){
            this.guests = `${diffInDays} nights, ${adultsNumber} adults, ${childrenNumber} children`;
          }else{
            this.guests = `${diffInDays} nights, ${adultsNumber} adults`
          }
         
        }
        
      }
    );

    this.subscription = this.headerService.logoClickEvent.subscribe(
      (eventData) => {
        if (eventData) {
          this.getAllCabins();
          this.guests = null;
          this.numberOfNights = null;
        }
        
      }
    );
    

 

    

    this.subscription = this.activatedRoute.paramMap.subscribe(() => {
      if(history.state.data){
          this.getAvailableCabins(history.state.data);
          this.check_in = history.state.data[0];
          this.check_out = history.state.data[1];
          const adultsNumber = parseInt(history.state.data[4]);
          const childrenNumber = parseInt(history.state.data[5]);
          const checkIn = new Date(history.state.data[0]);
          const checkOut = new Date(history.state.data[1]);
          // Get the difference in milliseconds
          const diffInMs = checkOut.getTime() - checkIn.getTime();

          // Convert milliseconds to days
          const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
          
          this.numberOfNights = diffInDays;

          if(adultsNumber > 0 && childrenNumber > 0){
            this.guests = `${diffInDays} nights, ${adultsNumber} adults, ${childrenNumber} children`;
          }else{
            this.guests = `${diffInDays} nights, ${adultsNumber} adults`
          }
      }else if(history.state.getAllCabins){
        this.getAllCabins();
      }else{
        this.getAllCabins();
      }
    })
    
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  

  getAllCabins(){
     this.cabins$ = this.http.get<Cabin[]>('http://localhost:3000/');

  }

  getAvailableCabins(data: string[]){
    const pets = data[3] === 'true' ? 1 : 0; 

    this.cabins$ = this.http.get<Cabin[]>('http://localhost:3000/api/cabins/availability', {
      params: {
        start_date: data[0],
        end_date: data[1],
        destination: data[2],
        pets: pets
      }
    }); 
    
   
  }
  

}


