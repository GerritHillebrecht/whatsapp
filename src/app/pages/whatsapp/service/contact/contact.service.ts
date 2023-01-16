import { Injectable } from '@angular/core';
import { UserFragment, WhatsappUser } from '@whatsapp/interface';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';

interface SearchArgs {
  searchString: string;
}

const SEARCH_USER_QUERY = gql`
  ${UserFragment}

  query SearchContacts($searchString: String!) {
    searchContacts(searchString: $searchString) {
      ...UserFragment
    }
  }
`;

interface SearchUserQueryResult {
  __typename: 'Query';
  searchContacts: WhatsappUser[];
}

interface SearchUserQueryVariables {
  searchString: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  constructor(private apollo: Apollo) {}

  searchUser({ searchString }: SearchArgs): Observable<WhatsappUser[]> {
    return this.apollo
      .query<SearchUserQueryResult, SearchUserQueryVariables>({
        query: SEARCH_USER_QUERY,
        variables: { searchString },
      })
      .pipe(map((result) => result.data.searchContacts));
  }
}
