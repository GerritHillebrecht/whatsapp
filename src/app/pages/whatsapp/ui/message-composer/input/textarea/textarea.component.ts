import { CommonModule } from '@angular/common';
import {
  Component,
  OnDestroy,
  Input,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  Subject,
  switchMap,
  takeUntil,
  Observable,
} from 'rxjs';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Select } from '@ngxs/store';

import { MessageComposeService, MessageService } from '@whatsapp/service';
import { WhatsappContact } from '@whatsapp/interface';
import { WhatsappStateModel as WSM } from '@whatsapp/store';

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
})
export class TextareaComponent implements OnDestroy, AfterViewInit {
  @ViewChild('textArea')
  elementRef: ElementRef<HTMLInputElement> | undefined;

  @Select(({ whatsapp }: { whatsapp: WSM }) => whatsapp.selectedContact)
  selectedContact$: Observable<WhatsappContact[]> | undefined;

  @Input()
  form: FormGroup | undefined;

  @Input()
  control: FormControl | undefined;

  destroy$ = new Subject<void>();

  constructor(private message: MessageService) {}

  ngAfterViewInit(): void {
    const { nativeElement } = this.elementRef!;

    // Register the resizeTextarea and registerKeydownEvent methods
    try {
      this.resizeTextarea(nativeElement, this.control!);
      this.registerKeydownEvent(nativeElement, this.form!);
    } catch (e) {
      console.error(e);
    }

    // Focus Chat Input after selecting a contact
    this.selectedContact$?.subscribe(() => nativeElement.focus());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * This function resizes a textarea based on the length of the value in the form control.
   * @param element The HTML element of the textarea.
   * @param control The form control that contains the value of the textarea.
   */
  resizeTextarea(element: HTMLInputElement, control: FormControl) {
    control!.valueChanges
      .pipe(debounceTime(50), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value: string) => {
        // Set the height of the textarea to auto so that it can shrink
        element.style.height = 'auto';
        // Calculate the height of the textarea
        const scrollHeight = element.scrollHeight;
        // Set the height of the textarea to the calculated height
        element.style.height =
          value?.length > 0 ? `calc(${scrollHeight}px + 4px)` : `auto`;
      });
  }

  /**
   * This method subscribes to the keydown event on the input element.
   * It only triggers when the user presses the enter key while holding the ctrl key.
   * It also filters out any keydown events that are not valid.
   * Finally, it only triggers when the message form is valid.
   */
  registerKeydownEvent(element: HTMLInputElement, form: FormGroup) {
    fromEvent<KeyboardEvent>(element, 'keydown')
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(100),
        distinctUntilChanged(),
        filter((input) => input.key === 'Enter' && input.ctrlKey && form.valid),
        switchMap(() => this.message.sendMessage())
      )
      .subscribe({
        error: (err) => {
          console.error(err);
        },
      });
  }
}
