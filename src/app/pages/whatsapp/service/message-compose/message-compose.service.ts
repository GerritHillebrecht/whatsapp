import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class MessageComposeService {
  messageForm: FormGroup;

  get messageControl(): FormControl {
    return this.messageForm.get('text') as FormControl;
  }

  get imageControl(): FormControl {
    return this.messageForm.get('image') as FormControl;
  }

  constructor(private apollo: Apollo) {
    this.messageForm = this.createMessageForm();
  }

  // This function creates the form for a message. It returns a FormGroup.
  createMessageForm(): FormGroup {
    return new FormGroup({
      text: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(1),
      ]),
      image: new FormControl<File | null>(null),
    });
  }
}
