
import { Component, ViewEncapsulation, ViewChild, HostListener, Output, Injectable, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy } from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatDateRangePicker } from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms'; 
import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventEmitter } from '@angular/core';
import { Cabin } from '../../core/models/cabin';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { HeaderService } from '../../core/services/header.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';








@Injectable({
  providedIn: 'root'
})
export class searchAvailableCabinsEvent {
  events = new EventEmitter<string[]>();
}


@Component({
  selector: 'app-search-available-cabins-form',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatFormFieldModule, MatDatepickerModule, FormsModule, ReactiveFormsModule, CommonModule, MatSlideToggleModule, RouterModule],
  templateUrl: './search-available-cabins-form.component.html',
  styleUrl: './search-available-cabins-form.component.scss',
  encapsulation: ViewEncapsulation.None
})



export class SearchAvailableCabinsFormComponent implements OnInit{


  
  constructor(private http: HttpClient, private searchEvent: searchAvailableCabinsEvent, private headerService: HeaderService, private router: Router) {}

  isDestinationEmpty = false;
  isDestinationInputFocused: boolean = false;
  isSelectDateFocused: boolean = false;
  isInputFocused: boolean = false;
  isGuestsOptionsOpen: boolean = false;
  minDate!: Date;
  adultsNumber: number = 1;
  childrenNumber: number = 0;
  petsNumber: number = 0;
  
  

  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
    pets: new FormControl(false)
  });

  check_in: string | Date = 'Check-in'; 
  check_out: string | Date = 'Check-out';
  check_in_database: string | Date = this.check_in;
  check_out_database: string | Date = this.check_out;
  
  available_cabins$!: Observable<Cabin[]>; 

  ngOnInit() {
    //Subscribe to form value changes to update `myDate` later
    this.range.valueChanges.subscribe(value => {
      if (value.start) {
        this.check_in = formatDate(value.start, 'EEE, MMM d, y', 'en-us'); 
      }

      if (value.end) {
        this.check_out = formatDate(value.end, 'EEE, MMM d, y', 'en-us');
      }
      
    });



    
    
    
    this.range.valueChanges.subscribe(value => {
      if (value.start) {
        this.check_in_database = formatDate(value.start, 'y-MM-dd', 'en-us'); 
      }

      if (value.end) {
        this.check_out_database = formatDate(value.end, 'y-MM-dd', 'en-us');
      }
    });

    this.minDate = new Date();




    this.destinationValue.valueChanges.subscribe(value => {
      this.destinationValueTrack = value!;
      this.getDestination(value!);
      
    });


    this.headerService.logoClickEvent.subscribe(() => {
      this.destinationValue.setValue('');
      this.range.get('pets')?.setValue(false);
      this.adultsNumber = 1;
      this.childrenNumber = 0;
      this.check_in = 'Check-in';
      this.check_out = 'Check-out';

    })
  } 





 //Destination Search Input autocomplete logic
  destinationValueTrack: string = '';
  destinationValue = new FormControl('');
  destinationSearchResults!: any[];
  
  getDestination(destination: string){
    this.http.get<any[]>(`http://localhost:3000/cabin/search/byDesinationInput?input_characters=${destination}`).subscribe(result => {
      this.destinationSearchResults = result;
    })
    
  }
  setDestinationInputValue(value: string){
    this.destinationValue.setValue(value);
  }
  



  

  
  searchAvailableCabins(){

    if(!this.destinationValue.value){
      this.isDestinationEmpty = true;
    }else{
        
    //If only the check in-date is selected than add by default the next day to check-out date when button is pressed
    if(this.check_in_database != 'Check-in' && this.check_out_database === 'Check-out'){
      this.check_out_database = new Date(this.check_in_database);
      this.check_out_database.setDate(this.check_out_database.getDate() + 1)
      this.check_out_database = formatDate( this.check_out_database, 'y-MM-dd', 'en-us'); 

      this.check_in = formatDate(this.check_in_database, 'EEE, MMM d, y', 'en-us'); 
      this.check_out = formatDate(this.check_out_database, 'EEE, MMM d, y', 'en-us');

      const start = this.check_in_database.toString().split('T')[0];
      const end = this.check_out_database.toString().split('T')[0];
      
    }


    if(this.check_in_database === 'Check-in' && this.check_out_database === 'Check-out'){
      this.check_in_database = new Date();
      this.check_out_database = new Date(this.check_in_database);
      this.check_out_database.setDate(this.check_out_database.getDate() + 1);
      this.check_out_database = formatDate( this.check_out_database, 'y-MM-dd', 'en-us'); 
      this.check_in_database = formatDate( this.check_in_database, 'y-MM-dd', 'en-us');
      
      this.check_in = formatDate(this.check_in_database, 'EEE, MMM d, y', 'en-us'); 
      this.check_out = formatDate(this.check_out_database, 'EEE, MMM d, y', 'en-us');

      const start = this.check_in_database.toString().split('T')[0];
      const end = this.check_out_database.toString().split('T')[0];
      
    }


    const start = this.check_in_database.toString().split('T')[0];
    const end = this.check_out_database.toString().split('T')[0];

    const petsAllowed = this.range.get('pets')!.value ? 'true' : 'false';

    
    
    this.searchEvent.events.emit([start, end, this.destinationValue.value, petsAllowed, this.adultsNumber.toString(), this.childrenNumber.toString()]);

    this.router.navigate([''], {state: {data: [start, end, this.destinationValue.value, petsAllowed, this.adultsNumber.toString(), this.childrenNumber.toString()]}});


    

    }
   
      
    
    
    
     
    
    
  }

  toggle_guests_options_visibility(){
      this.isGuestsOptionsOpen = !this.isGuestsOptionsOpen;
  }




  @HostListener('document:click', ['$event'])
  closeDropdownOnClickOutside(event: MouseEvent) {
    const clickedInside = (event.target as HTMLElement).closest('.dateForm');
    
    if (!clickedInside) {
      this.isGuestsOptionsOpen = false;
    }
  }

  

  increaseGuests(guests: number): number{
      if(guests < 10){
        return guests + 1;
      }else{
        return guests;
      }
        
  }

  decreaseGuests(guests: number): number{
    if(guests > 0){
      return guests - 1;
    }else{
    return guests;
    }
  }
}
