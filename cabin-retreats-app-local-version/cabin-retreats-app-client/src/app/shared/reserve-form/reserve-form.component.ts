import { Component, Inject } from '@angular/core';
import { Cabin } from '../../core/models/cabin';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reserve-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './reserve-form.component.html',
  styleUrl: './reserve-form.component.scss'
})
export class ReserveFormComponent {
  isNewUser: boolean = false;
  showSelectUser: boolean = true;
  isExistingUser: boolean = false;
  inputWarning!: string;
  showInputWarning!: string;
  showSuccesMessage: boolean = false;
  showUserExistsWarning: boolean = false;
  showWrongEmailPasswordWarning: boolean = false;
  showInputWarning_forExistingUserForm!: string;
  

  bookFormNewUser = new FormGroup({
    name: new FormControl(''),
    surname: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl('')
  });


  bookFormExistingUser = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  })

  constructor(@Inject(DIALOG_DATA) public data: any, private dialogRef: DialogRef, private http: HttpClient){
  }

  bookWithNewUser(){
    
    if(!this.bookFormNewUser.value.name){
      this.inputWarning = "Please insert a name";
      this.showInputWarning = 'name';
    }else if(!this.bookFormNewUser.value.surname){
      this.inputWarning = "Please insert a surname";
      this.showInputWarning = 'surname';
    }else if(!this.bookFormNewUser.value.email){
      this.inputWarning = "Please insert a email";
      this.showInputWarning = 'email';
    }else if(!this.bookFormNewUser.value.password){
      this.inputWarning = "Please insert a password";
      this.showInputWarning = 'password';
    }else{
      this.http.post<{message: string}>('http://localhost:3000/create/booking/newUser', 
        {user: {
                name: this.bookFormNewUser.value.name,
                surname: this.bookFormNewUser.value.surname,
                email: this.bookFormNewUser.value.email,
                password: this.bookFormNewUser.value.password
              },
          booking: {
                    cabin_id: this.data[0].id,
                    start_date: this.data[1][1],
                    end_date: this.data[1][2]
                   }
        }
      ).subscribe(data =>{
        if(data.message === "User already exists"){
          this.showUserExistsWarning = true;
        }else{
          this.showSelectUser = false;
          this.isExistingUser = false;
          this.isNewUser = false;
          this.showSuccesMessage = true;
          this.showInputWarning = '';
          this.showUserExistsWarning = false;
        }
  
      })
      
    
    }
  }

  bookWithExistingUser(){
      if(!this.bookFormExistingUser.value.email){
        this.showInputWarning_forExistingUserForm = 'email';
      }else if(!this.bookFormExistingUser.value.password){
        this.showInputWarning_forExistingUserForm = 'password';
      }else{
        this.http.post<{message: string}>('http://localhost:3000/create/booking/existingUser', 
          {
            email: this.bookFormExistingUser.value.email,
            password: this.bookFormExistingUser.value.password,
            booking: {
              cabin_id: this.data[0].id,
              start_date: this.data[1][1],
              end_date: this.data[1][2]
             }
          }
        ).subscribe(data => {
          if(data.message === "Wrong email or password"){
            this.showWrongEmailPasswordWarning = true;
            this.showInputWarning_forExistingUserForm = '';
            this.bookFormExistingUser.get('email')?.setValue('');
            this.bookFormExistingUser.get('password')?.setValue('');
          }else{
            this.showSelectUser = false;
            this.isExistingUser = false;
            this.isNewUser = false;
            this.showSuccesMessage = true;
            this.showInputWarning_forExistingUserForm = '';
          }
        })
       
      }
  }

  closeModal(){
    this.dialogRef.close();
  }
}
