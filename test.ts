const input = {
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

interface IField {
  [key: string]: IField | string[];
}

type FieldType = Array<string | IField>;

interface IProjection {
  type?: "interface" | "union";
  fragment?: string;
  fields: FieldType;
}

interface IArgs {
  name: string;
  scaler: string;
  value: any;
}

interface InputPayload {
  type: "query" | "mutation";
  name: string;
  data: {
    entity: string;
    project: IProjection[];
    args: IArgs[];
  };
}

const testInput: InputPayload = {
  type: "query",
  name: "fetchBooks",
  data: {
    entity: "user",
    project: [
      {
        fields: [
          "id",
          "email",
          "status",
          "firstName",
          {
            abc: ["some", "value"]
          },
          "lastName"
        ]
      },
      {
        type: "union",
        fragment: "addresses",
        fields: ["streetNumber", "streetName", "zip"]
      }
    ],
    args: [
      {
        name: "input",
        scaler: "USER",
        value: {
          firstName: "qweqwe",
          lastName: "qwerty"
        }
      },
      {
        name: "userId",
        scaler: "String!",
        value: 3011
      }
    ]
  }
};

const build = (input: InputPayload) => {
  let query: string = ``;
  let variables: any = {};

  const tag = (number: number) => `$var${number}`;

  const prepareArgs = (args: InputPayload["data"]["args"]) => {
    const result: {
      args: string;
      argsMap: Array<{
        tag: string;
        mapTo: string;
      }>;
      vars: {
        [key: string]: any;
      };
    } = {
      args: "",
      vars: {},
      argsMap: []
    };

    const _args = args.map((arg: IArgs, index: number) => {
      const _tag = tag(index + 1);

      result.vars[_tag] = arg.value;

      result.argsMap.push({
        tag: _tag,
        mapTo: arg.name
      });

      return `${_tag}: ${arg.scaler}`;
    });

    result.args = `( ${_args.join(", ")} )`;

    return result;
  };

  //
  //

  const prepareEntity = (data: InputPayload["data"]) => {
    const { args, vars, argsMap } = prepareArgs(data.args);

    const _params = argsMap.map(arg => {
      return `${arg.mapTo}: ${arg.tag}`;
    });

    const entity = `${data.entity} ( ${_params.join(", ")} )`;

    return {
      args,
      vars,
      entity
    };
  };

  //
  //

  const prepareProjection = (projection: InputPayload["data"]["project"]) => {
    const selection: string[] = [];

    const getFields = (fields: FieldType, result: string[] = []) => {
      fields.forEach((field: any) => {
        if (typeof field === "object") {
          for (const [key, _fields] of Object.entries(field)) {
            result.push(`${key} {`);
            getFields(_fields as FieldType, result);
            result.push("}");
          }
        } else {
          result.push(` ${field} `);
        }
      });

      return result.join("\n");
    };

    projection.forEach((project: IProjection) => {
      if (project.type) {
        if (project.type === "interface" || project.type === "union") {
          selection.push(`... on ${project.fragment} {`);
          selection.push(getFields(project.fields));
          selection.push(`}`);
        }
      } else {
        selection.push(getFields(project.fields));
      }
    });

    return selection.join("\t");
  };

  const { entity, args, vars } = prepareEntity(input.data);
  const projection = prepareProjection(input.data.project);

  //
  //
  //

  query = `
    ${input.type} ${input.name} ${args} {
      ${entity} {
        ${projection}
      }
    }
  `;

  query = query.replace(/\n|\t/g, "").trim();
  variables = vars;

  return {
    query,
    variables
  };
};

const result = build(testInput);

console.info(result);
