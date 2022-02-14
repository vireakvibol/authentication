import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { initializeApp } from 'firebase/app';
import {
  Auth,
  ConfirmationResult,
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  UserCredential,
} from 'firebase/auth';
import CONFIG from 'src/config.json';
import {
  PhoneNumber,
  PhoneNumberFormat,
  PhoneNumberUtil,
} from 'google-libphonenumber';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private recaptchaVerifier!: RecaptchaVerifier;
  private firebaseAuth!: Auth;
  private confirmationResult!: ConfirmationResult;
  private tel!: string;
  private password!: string;
  private country_code!: string;

  constructor(private httpClient: HttpClient) {}

  public async RecaptchaVerifierRender(): Promise<void> {
    try {
      initializeApp(CONFIG.FIREBASE_CONFIG);

      this.firebaseAuth = getAuth();
      this.firebaseAuth.useDeviceLanguage();
      this.recaptchaVerifier = new RecaptchaVerifier(
        'recaptcha-container',
        {
          size: 'invisible',
          callback: (response: string) => {
            console.log(response);
          },
        },
        this.firebaseAuth
      );
    } catch (error) {
      console.log(error);
    }
  }

  public async submit(tel: string, password: string): Promise<void> {
    this.tel = tel;
    this.password = password;

    try {
      const ipinfo: { country_code: string } = await this.httpClient
        .get<{ country_code: string }>('https://ipapi.co/json')
        .toPromise();
      this.country_code = ipinfo.country_code;
    } catch (error) {
      console.log(error);
      throw new Error('failed to request country code!');
    }

    try {
      await this.register();
    } catch (error) {
      console.log(error);
      throw new Error('failed to signin.');
    }

    // await this.recaptchaVerifier.render();

    // const result: string = await this.httpClient.post<string>(CONFIG.ENDPOINT_URL + '/authentication/register', {

    // }).toPromise;
  }

  private async register(): Promise<void> {
    // add credential to basic auth header
    const httpHeaders = {
      headers: new HttpHeaders({
        'CONTEXT-TYPE': 'application/json',
        AUTHORIZATION: 'Basic ' + btoa(this.tel + ':' + this.password),
      }),
    };

    try {
      const response = await this.httpClient
        .post(CONFIG.ENDPOINT_URL + '/authentication/login', {}, httpHeaders)
        .toPromise();
      if (response === null) {
        return;
      }
    } catch (error: ?{ status: number } | unknown) {
      if (error.status !== 403) {
        throw new Error('failed to register');
      }
      await this.recaptchaVerifier.render();
      throw new error(403);
    }
  }

  public async sendingOTP(): Promise<void> {
    try {
      const tel: string = await this.formatPhoneNumber();
      this.confirmationResult = await signInWithPhoneNumber(
        this.firebaseAuth,
        tel,
        this.recaptchaVerifier
      );
    } catch (error) {
      console.log(error);
      throw new Error('invalid otp');
    }
  }

  public async validateOTP(otp: string): Promise<UserCredential> {
    try {
      const response: UserCredential = await this.confirmationResult.confirm(otp);
      return response;
    } catch (error) {
      console.log(error);
      throw new Error('invalid otp');
    }
  }

  private async formatPhoneNumber(): Promise<string> {
    try {
      const number: PhoneNumber =
        PhoneNumberUtil.getInstance().parseAndKeepRawInput(
          this.tel,
          this.country_code
        );
      const phoneNumber: string = PhoneNumberUtil.getInstance().format(
        number,
        PhoneNumberFormat.INTERNATIONAL
      );

      return phoneNumber;
    } catch (error) {
      console.log(error)
      throw new Error('failed to format phone number');
    }
  }
}
