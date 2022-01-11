import gql from "graphql-tag"

export const ENS_SUGGESTIONS = gql`
  query lookup($name: String!) {
    domains(where: { name: $name }) {
      resolvedAddress {
        id
      }
      owner {
        id
      }
      name
      resolver {
        texts
        coinTypes
        contentHash
      }
    }
  }
`
