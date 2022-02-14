import { FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { PhoneNumberUtil, PhoneNumber } from 'google-libphonenumber';
import { Observable, Observer } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export function PhoneValidator(httpCLient: HttpClient) {
  return (control: FormControl) => {
    return new Observable((observer: Observer<ValidationErrors | null>) => {
      httpCLient
        .get<{ country_code: string }>('https://ipapi.co/json')
        .subscribe((res: { country_code: string }) => {
          try {
            const phoneUtil = PhoneNumberUtil.getInstance();
            const phoneNumber: PhoneNumber = phoneUtil.parseAndKeepRawInput(
              control.value,
              res.country_code
            );

            if (phoneUtil.isValidNumber(phoneNumber) === true) {
              observer.next(null);
            } else {
              observer.next({ error: true, duplicated: true });
              throw new Error();
            }
          } catch (error) {
            observer.next({ error: true, duplicated: true });
          }

          observer.complete();
        });
    });
  };
}
