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
  takeUntil,
  Observable,
  forkJoin,
} from 'rxjs';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Select, Store } from '@ngxs/store';

import { WhatsappContact } from '@whatsapp/interface';
import { SendMessage, WhatsappStateModel as WSM } from '@whatsapp/store';
import { ScreenSizeService } from '@core/services/screen-size';

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

  constructor(private store: Store, private screenSize: ScreenSizeService) {}

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
    forkJoin({
      selectedContact: this.selectedContact$!,
      small: this.screenSize.twSm$,
    }).subscribe((res) => (res.small ? nativeElement.focus() : null));
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
        filter(
          (input) =>
            input.key === 'Enter' &&
            input.ctrlKey &&
            (form.get('text')!.valid || form.get('image')!.valid)
        )
      )
      .subscribe({
        next: async (res) => {
          this.store.dispatch(new SendMessage());
        },
        error: (err) => {
          console.error(err);
        },
      });
  }
}
