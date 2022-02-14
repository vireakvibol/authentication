import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomeService } from './home.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PhoneValidator } from 'src/validators/phone.validator';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserCredential } from 'firebase/auth';

@Component({
  selector: 'app-login',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
})
export class HomeComponent implements OnInit {
  validateForm!: FormGroup;
  OTPForm!: FormGroup;
  loading: boolean = false;
  OTPFormEnable: boolean = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
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
        await this.homeService.submit(
          this.validateForm.value.phone,
          this.validateForm.value.password
        );
        this.nzMessage.success('Login Success!');
        return;
      } catch (error) {
        console.log(error);
        if ((error = !403)) {
          this.loading = false;
          this.nzMessage.error('Incorrect credential!');
          return;
        }
        this.OTPFormEnable = true;
        this.loading = false;
        this.nzMessage.info('Confirmation code is sending...');
      }

      try {
        await this.homeService.sendingOTP();
        return;
      } catch(error){
        console.log(error);
        this.nzMessage.error('Incorrect SMS code!');
        return;
      }
    }

    this.nzMessage.error('Please input your phone and password!');
  }

  async ngOnInit(): Promise<void> {
    this.homeService.RecaptchaVerifierRender();

    this.validateForm = this.fb.group({
      phone: [null, [Validators.required], [PhoneValidator(this.httpClient)]],
      password: [null, [Validators.required]],
    });

    this.OTPForm = this.fb.group({
      otp: [null, [Validators.required]],
    });
  }

  async submitOTP(): Promise<void> {
    this.loading = true;
    try {
      const userCredential: UserCredential = await this.homeService.validateOTP(this.OTPForm.value.otp);
      console.log(userCredential);
      this.nzMessage.success('Login Success!');
      return;
    } catch (error) {
      console.log(error);
    }
    this.loading = false;
    this.nzMessage.error('Incorrect SMS code!');
  }
}
