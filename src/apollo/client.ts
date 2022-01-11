import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client"

export const ensClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "https://api.thegraph.com/subgraphs/name/ensdomains/ens",
  }),
})
