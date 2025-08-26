import { Component, OnInit } from '@angular/core';
import { SearchAvailableCabinsFormComponent } from '../../shared/search-available-cabins-form/search-available-cabins-form.component';
import { RouterModule } from '@angular/router';
import { HeaderService } from '../../core/services/header.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SearchAvailableCabinsFormComponent, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(private headerService: HeaderService){}

  emitGetAllCabins(){
    this.headerService.logoClickEvent.emit('getAllCabins');
  }

}
