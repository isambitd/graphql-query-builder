import { expect } from "chai";
import { build, InputPayload } from "../index";

describe("Get GraphQL query from json", () => {
  it("should return Union Query", () => {
    const testInput: InputPayload = {
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
    };
    const { query, variables } = build(testInput);
    expect(query).to.equal(
      `query fetchBooks ($var1: USER,$var2: String!,$var3: String!,$var4: number,$var5: number) {user (input: $var1,userId: $var2) { id email status firstName lastName ... on addresses { streetNumber streetName zip } coupons (lang: $var3) { ID couponName couponValue couponDetails (limit: $var4,sort: $var5) { createAt updatedAt } } } }`
    );
    expect(variables).to.not.null;
    expect(variables).to.have.property("var1");
    expect(variables.var1).to.deep.equal({
      firstName: "Sambit",
      lastName: "Das"
    });
    expect(variables).to.have.property("var2");
    expect(variables.var2).to.deep.equal(3011);
    expect(variables).to.have.property("var3");
    expect(variables.var3).to.deep.equal("EN");
    expect(variables).to.have.property("var4");
    expect(variables.var4).to.deep.equal(10);
    expect(variables).to.have.property("var5");
    expect(variables.var5).to.deep.equal("createdAt");
  });
  it("should return Mutation with proper variables", () => {
    const testInput: InputPayload = {
      type: "mutation",
      name: "testCreateUser",
      map: {
        entity: "createUser",
        project: [
          "id",
          "email",
          "status",
          "firstName",
          "lastName",
          {
            entity: "address",
            project: [
              "streetNumber",
              "streetName",
              "city",
              "state",
              "country",
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
                  },

                  {
                    name: "page",
                    graphQlType: "number",
                    value: 1
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
            graphQlType: "CreateUserInput",
            value: {
              firstName: "Sambit",
              lastName: "Das",
              phone: "11223344",
              zip: 10178,
              email: "isambitd@gmail.com"
            }
          }
        ]
      }
    };
    const { query, variables } = build(testInput);
    expect(query).to.equal(
      `mutation testCreateUser ($var1: CreateUserInput,$var2: String!,$var3: number,$var4: number,$var5: number) {createUser (input: $var1) { id email status firstName lastName address (lang: $var2) { streetNumber streetName city state country couponDetails (limit: $var3,sort: $var4,page: $var5) { createAt updatedAt } } } }`
    );
    expect(variables).to.not.null;
    expect(variables).to.have.property("var1");
    expect(variables.var1).to.deep.equal({
      firstName: "Sambit",
      lastName: "Das",
      phone: "11223344",
      zip: 10178,
      email: "isambitd@gmail.com"
    });
    expect(variables).to.have.property("var2");
    expect(variables.var2).to.deep.equal("EN");
    expect(variables).to.have.property("var3");
    expect(variables.var3).to.deep.equal(10);
    expect(variables).to.have.property("var4");
    expect(variables.var4).to.deep.equal("createdAt");
    expect(variables).to.have.property("var5");
    expect(variables.var5).to.deep.equal(1);
  });
});
