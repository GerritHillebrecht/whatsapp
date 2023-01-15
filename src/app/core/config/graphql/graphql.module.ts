import { NgModule } from '@angular/core';
import { GRAPHQL_PROVIDER } from './graphql.provider';
import { ApolloModule } from 'apollo-angular';

@NgModule({
  exports: [ApolloModule],
  providers: [GRAPHQL_PROVIDER],
})
export class GraphQLModule {}
