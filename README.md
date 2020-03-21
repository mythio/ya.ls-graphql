# ya.ls-graphql
Yet another link shortener GraphQL backend

![Node.js CI](https://github.com/mythio/ya.ls-graphql/workflows/Node.js%20CI/badge.svg)


## Makes use of `query` and `mutation`

### Types
1. `UserDetail`
```
type UserDetail {
  userId: ID!
  name: String!
  emailAddress: String!
  shortIds: [ShortUrl!]
}
```

2. `User`
```
type User {
  userId: ID!
  name: String!
  emailAddress: String!
}
```

3. `ShortUrlDetail`
```
type ShortUrlDetail {
  shortId: String!
  originalUrl: String!
  shareWith: [User!] @auth(requires: USER)
  createdBy: User
}
```

4. `ShortUrl`
```
type ShortUrl {
  shortId: String!
  originalUrl: String!
  shareWith: [ID!]
}
```

5. `AuthData`
```
type AuthData {
  token: String!
  userId: ID!
}
```

### Queries

1. `login(emailAddress: String!, password: String!): AuthData!`

Get `jwt` token for verification and authentication


2. `expandUrl(shortId: String!): ShortUrlDetail! @auth`

Get the original url for the specified `shortId`


3. `me: UserDetail! @auth(requires: USER)`

Get the details of the current logged in user
Requires authentication as USER



### Mutations

1. `createUser(name: String!, emailAddress: String!, password: String!): User!`

Creates a user for the specified the data


2. `shortenUrl(originalUrl: String!, shareWith: [ID!]): ShortUrl! @auth`

Creates a short url for the specified url

