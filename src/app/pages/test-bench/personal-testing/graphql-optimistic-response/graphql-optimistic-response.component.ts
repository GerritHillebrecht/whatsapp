import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Apollo } from 'apollo-angular';
import { WhatsappMessage, WhatsappMessageQueryDto } from '@whatsapp/interface';
import { map } from 'rxjs';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { take } from 'rxjs';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import {
  MESSAGE_QUERY,
  MessageQueryResult,
  MessageQueryVariables,
  MESSAGE_CREATE_MUTATION,
  MessageCreateResult,
  MessageCreateVariables,
  MESSAGE_UPDATE_MUTATION,
  MessageUpdateResult,
  MessageUpdateVariables,
  MESSAGE_DELETE_MUTATION,
  MessageDeleteResult,
  MessageDeleteVariables,
} from './typedDocumentNodes.graphql';

@Component({
  selector: 'app-graphql-optimistic-response',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './graphql-optimistic-response.component.html',
  styleUrls: ['./graphql-optimistic-response.component.scss'],
})
export class GraphqlOptimisticResponseComponent {}
