# graphql-query-builder

install via npm
```
npm i graphql-query-builder-json
```


The format of the json to create a GraphQL Query

```
{
  type: "query",
  name: "fetchBooks",
  map: {
    entity: "user",
    project: [
      "field1", "field2", "can add map upto nth nested level"
    ],
    args: [
      {
        name: "name of the argument mentioned in the schema",
        graphQlType: "type of the argument mentioned in the schema",
        value: "send the value whatever need to be sent"
      }
    ],// OPTIONAL
    type: "union" | "interface" | null // OPTIONAL
  }
}
```

Here is an example on how we can use this builder

```
{
  type: "query",
  name: "fetchBooks",
  map: {
    entity: "user",
    project: [
      "id",
      "email",
      "status",
      "firstName",
      "lastName",
      {
        type: "union",
        entity: "addresses",
        project: ["streetNumber", "streetName", "zip"]
      },
      {
        entity: "coupons",
        project: [
          "ID",
          "couponName",
          "couponValue",
          {
            entity: "couponDetails",
            project: ["createAt", "updatedAt"],
            args: [
              {
                name: "limit",
                graphQlType: "number",
                value: 10
              },
              {
                name: "sort",
                graphQlType: "number",
                value: "createdAt"
              }
            ]
          }
        ],
        args: [
          {
            name: "lang",
            graphQlType: "String!",
            value: "EN"
          }
        ]
      }
    ],
    args: [
      {
        name: "input",
        graphQlType: "USER",
        value: {
          firstName: "Sambit",
          lastName: "Das"
        }
      },
      {
        name: "userId",
        graphQlType: "String!",
        value: 3011
      }
    ]
  }
}
```

This JSON query is converted to this `query`

```
query fetchBooks($var1: USER, $var2: String!, $var3: String!, $var4: number, $var5: number) {
  user(input: $var1, userId: $var2) {
    id
    email
    status
    firstName
    lastName
    ... on addresses {
      streetNumber
      streetName
      zip
    }
    coupons(lang: $var3) {
      ID
      couponName
      couponValue
      couponDetails(limit: $var4, sort: $var5) {
        createAt
        updatedAt
      }
    }
  }
}
```

And the `varibales` will be

```
{
  var1: { firstName: 'qweqwe', lastName: 'qwerty' },
  var2: 3011,
  var3: 'EN',
  var4: 10,
  var5: 'createdAt'
}
```

One of the best place to format the GraphQL queryString is - http://toolbox.sangria-graphql.org/format
