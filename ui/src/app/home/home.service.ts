import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { initializeApp } from 'firebase/app';
import {
  Auth,
  ConfirmationResult,
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';
import CONFIG from 'src/config.json';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private recaptchaVerifier!: RecaptchaVerifier;
  private firebaseAuth!: Auth;
  private confirmationResult!: ConfirmationResult;

  constructor(private httpClient: HttpClient) {}

  public async RecaptchaVerifierRender(): Promise<void> {
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
  }

  public async submit(phone: string): Promise<void> {
    await this.recaptchaVerifier.render();

    // this.httpClient.get('http://localhost:3000/');

    try {
      this.confirmationResult = await signInWithPhoneNumber(
        this.firebaseAuth,
        phone,
        this.recaptchaVerifier
      );
    } catch (error) {
      console.log(error);
      throw new Error('invalid phone number');
    }
  }
}
