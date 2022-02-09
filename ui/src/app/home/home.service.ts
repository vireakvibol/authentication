import { Injectable } from '@angular/core';
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

  constructor() {}

  public async RecaptchaVerifierRender(): Promise<void> {
    initializeApp(CONFIG.FIREBASE);

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
