import { Component, Inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-cabin-image-gallery',
  standalone: true,
  imports: [],
  templateUrl: './cabin-image-gallery.component.html',
  styleUrl: './cabin-image-gallery.component.scss'
})
export class CabinImageGalleryComponent {

cabinPicture!: string;


constructor(@Inject(DIALOG_DATA) public data: any, private dialogRef: DialogRef){
  this.cabinPicture = this.data;
}

closeModal(){
  this.dialogRef.close();
}


}
