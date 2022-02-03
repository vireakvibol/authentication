import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
  
})

export class HomeComponent implements OnInit {
  validateForm!:FormGroup
  validateUsername = 'Please input your username!'
  validatePassword = 'Please input your password!'
  constructor(private fb:FormBuilder , private router: Router) { }

  submitForm(){
      if(this.validateForm.valid){
        this.router.navigateByUrl('home')
      }
  }

  
  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [null , [Validators.compose([
        Validators.required,
        Validators.maxLength(12),
      ])]],
      password: [null, [Validators.required]],
      remember: [true]
    })


  }

}
