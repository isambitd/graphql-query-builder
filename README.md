# graphql-query-builder
query builder for graphql from JSON
```
{
      type: "query",
      name: "fetchBooks",
      data: {
        name: "user",
        args: [
          [
            "input",
            "USER",
            {
              firstName: "qweqwe",
              lastName: "qwerty"
            }
          ],
          ["userId", "String!", 3011]
        ],
        props: [
          "id",
          "email",
          "status",
          "firstName",
          {
            name: "addresses",
            type: "union",
            props: ["streetNumber", "streetName", "zip"]
          }
        ]
      }
    }
```

This JSON query is converted to this query

```
query fetchBooks ($x1: USER,$x2: String!) {
    user (input: $x1,userId: $x2){
          id
          email
          status
          firstName
          ... on addresses {
            streetNumber
            streetName
            zip
          }
     }
}
```
