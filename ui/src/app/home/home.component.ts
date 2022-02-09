import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomeService } from './home.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PhoneValidator } from 'src/validators/phone.validator';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
})
export class HomeComponent implements OnInit {
  validateForm!: FormGroup;
  validateUsername: string = 'Please input your username!';
  validatePassword: string = 'Please input your password!';
  loading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private homeService: HomeService,
    private nzMessage: NzMessageService,
    private httpClient: HttpClient
  ) {}

  async submitForm(): Promise<void> {
    if (this.loading) {
      return;
    }

    if (this.validateForm.valid) {
      this.loading = true;

      try {
        await this.homeService.submit(this.validateForm.value.phone);
      } catch (error) {
        console.log(error)
        this.loading = false;
        this.nzMessage.error('Incorrect credential!');
      }

      return;
    }

    this.nzMessage.error('Please input your phone and password!');
  }

  async ngOnInit(): Promise<void> {
    this.homeService.RecaptchaVerifierRender();

    this.validateForm = this.fb.group({
      phone: [null, [Validators.required], [PhoneValidator(this.httpClient)]],
      password: [null, [Validators.required]],
    });
  }
}
