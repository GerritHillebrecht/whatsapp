import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { WhatsappUser } from '@whatsapp/interface';
import { ContactService } from '@whatsapp/service';
import {
  filter,
  debounceTime,
  distinctUntilChanged,
  map,
  combineLatest,
  startWith,
  switchMap,
  Observable,
  firstValueFrom,
} from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { AvatarComponent } from '@shared/ui/avatar';
import { Store } from '@ngxs/store';
import { WhatsappStateModel as WSM, SelectContact } from '@whatsapp/store';
import { ScreenSizeService } from '@core/services/screen-size';
import { Router } from '@angular/router';

type SearchResults =
  | Observable<{ label: string; contacts: WhatsappUser[] }[]>
  | undefined;

@Component({
  selector: 'app-contact-search-bar',
  standalone: true,
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    AvatarComponent,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './contact-search-bar.component.html',
  styleUrls: ['./contact-search-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ContactSearchBarComponent implements OnInit {
  form: FormGroup;

  get searchControl() {
    return this.form.get('search')!;
  }

  searchResults$: SearchResults;

  constructor(
    private contact: ContactService,
    private store: Store,
    private screenSize: ScreenSizeService,
    private router: Router
  ) {
    this.form = new FormGroup({
      search: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.searchResults$ = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter((input) => input?.length > 0),
      switchMap((input) =>
        combineLatest([
          this.store
            .select(({ whatsapp }: { whatsapp: WSM }) => whatsapp.contacts)
            .pipe(map((contacts) => this.filterContacts(contacts))),
          this.contact.searchUser({ searchString: input }),
        ]).pipe(
          map(([contacts, users]) =>
            [
              { label: 'Chats', contacts },
              { label: 'Kontakte', contacts: users },
            ].filter((result) => result.contacts.length > 0)
          )
        )
      ),
      startWith([])
    );
  }

  protected async handleSelection(user: WhatsappUser) {
    const { whatsapp }: { whatsapp: WSM } = this.store.snapshot();
    const contact = whatsapp.contacts.find((contact) => contact.id === user.id);

    if (!contact) return;
    this.searchControl.reset();
    this.store.dispatch(new SelectContact(contact));
    if (await firstValueFrom(this.screenSize.twSm$)) {
      this.router.navigate(['whatsapp', 'chat']);
    }
  }

  protected displayFn(user: WhatsappUser) {
    return user ? `${user.firstName} ${user.lastName}` : '';
  }

  private filterContacts(contacts: WhatsappUser[]): WhatsappUser[] {
    return contacts.filter((contact) => {
      const name = `${contact.firstName} ${contact.lastName}`
        .toLowerCase()
        .trim()
        .replaceAll(' ', '');
      const search = this.searchControl.value
        .toLowerCase()
        .trim()
        .replaceAll(' ', '');
      return name.includes(search);
    });
  }
}
