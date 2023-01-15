import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ApolloClientOptions, split, InMemoryCache } from '@apollo/client/core';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { environment } from 'environments/environment';
import { createClient } from 'graphql-ws';
import { Provider } from '@angular/core';

export const GRAPHQL_PROVIDER: Provider = {
  provide: APOLLO_OPTIONS,
  deps: [HttpLink],

  useFactory(httpLink: HttpLink): ApolloClientOptions<any> {
    // Create an http link:
    const http = httpLink.create({
      uri: `${environment.graphql.protocol.http}://${environment.graphql.uri}/graphql`,
    });

    // Create a WebSocket link:
    const ws = new GraphQLWsLink(
      createClient({
        url: `${environment.graphql.protocol.ws}://${environment.graphql.uri}/graphql`,
        shouldRetry: () => true,
      })
    );

    // Split based on operation type
    const link = split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      ws,
      http
    );

    return {
      link,
      cache: new InMemoryCache(),
    };
  },
};
