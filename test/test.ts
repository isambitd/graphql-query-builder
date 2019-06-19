import { expect } from "chai";
import { buildQuery } from "../index";

describe("getPlural function test", () => {
  it("should return mutation", () => {
    const newQ = {
      type: "mutation",
      name: "testUpdateUser",
      data: {
        name: "userUpdate",
        args: [
          [
            "input",
            "UserUpdateInput",
            {
              firstName: "qweqwe",
              lastName: "qwerty"
            }
          ],
          ["userId", "String!", 3011]
        ],
        props: ["id", "email", "status", "firstName"]
      }
    };
    const { query, variables } = buildQuery(newQ);
    expect(query).to.equal(
      `mutation testUpdateUser ($x1: UserUpdateInput,$x2: String!) {\n\t\tuserUpdate (input: $x1,userId: $x2){\n\t\t\tid\n\t\t\temail\n\t\t\tstatus\n\t\t\tfirstName\n\t\t}\n}`
    );
  });
  it("should return Union Query", () => {
    const newQ = {
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
    };
    const { query, variables } = buildQuery(newQ);
    expect(query).to.equal(
      `query fetchBooks ($x1: USER,$x2: String!) {\n\t\tuser (input: $x1,userId: $x2){\n\t\t\tid\n\t\t\temail\n\t\t\tstatus\n\t\t\tfirstName\n\t\t\t... on addresses {\n\t\t\t\tstreetNumber\n\t\t\t\tstreetName\n\t\t\t\tzip\n\t\t\t}\n\t\t}\n}`
    );
  });
  it("should return Union Query", () => {
    const newQ = {
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
            Abc: {
              def: "adsd"
            }
          },
          {
            name: "addresses",
            type: "union",
            props: ["streetNumber", "streetName", "zip"]
          }
        ]
      }
    };
    const { query, variables } = buildQuery(newQ);
    expect(query).to.equal(
      `query fetchBooks ($x1: USER,$x2: String!) {\n\t\tuser (input: $x1,userId: $x2){\n\t\t\tid\n\t\t\temail\n\t\t\tstatus\n\t\t\tfirstName\n\t\t\t... on addresses {\n\t\t\t\tstreetNumber\n\t\t\t\tstreetName\n\t\t\t\tzip\n\t\t\t}\n\t\t}\n}`
    );
  });
});
