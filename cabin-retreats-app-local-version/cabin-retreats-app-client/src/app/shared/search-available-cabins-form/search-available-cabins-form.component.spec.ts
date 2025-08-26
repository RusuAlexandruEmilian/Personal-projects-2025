import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAvailableCabinsFormComponent } from './search-available-cabins-form.component';

describe('SearchAvailableCabinsFormComponent', () => {
  let component: SearchAvailableCabinsFormComponent;
  let fixture: ComponentFixture<SearchAvailableCabinsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchAvailableCabinsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchAvailableCabinsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
