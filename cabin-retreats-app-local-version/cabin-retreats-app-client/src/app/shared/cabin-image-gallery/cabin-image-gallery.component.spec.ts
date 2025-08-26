import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabinImageGalleryComponent } from './cabin-image-gallery.component';

describe('CabinImageGalleryComponent', () => {
  let component: CabinImageGalleryComponent;
  let fixture: ComponentFixture<CabinImageGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CabinImageGalleryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CabinImageGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
