import {ref} from "vue";
import {ApolloClient, InMemoryCache} from "@apollo/client";

export type Nav = 'LANDING' | 'BACK' | 'FORWARD' | 'LINK';

export const back = ref<boolean>(false);
export const nav = ref<Nav>('LANDING');
export const text = ref("");
export const apollo = new ApolloClient({
    uri: "/graphql",
    cache: new InMemoryCache()
});