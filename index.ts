interface IVariables {
  [key: string]: IVariables | string | number | Date | [IVariables];
}

interface IArguments {
  [key: string]: string;
}

interface IMap {
  type?: "interface" | "union";
  entity: string;
  project?: Array<IMap | string>;
  args?: IArgs[];
}

interface IArgs {
  name: string;
  graphQlType: string;
  value: any;
}

interface InputPayload {
  type: "query" | "mutation" | "subscription";
  name: string;
  map: IMap;
}

interface IBuildFieldInput {
  map: IMap;
  variables: IVariables;
  args: IArguments;
  identifier: number;
}
interface IQuery {
  query: string;
  variables: IVariables;
  args: IArguments;
}

const formatArguments = (args: IArguments): string => {
  return args && Object.keys(args).length
    ? `(${Object.keys(args).map(key => `${key}: ${args[key]}`)})`
    : ``;
};

const build = (input: InputPayload) => {
  const { variables, query, args } = bindProjections({
    map: input.map,
    variables: {} as IVariables,
    args: {} as IArguments,
    identifier: 1
  });
  return {
    query: `${input.type} ${input.name} ${formatArguments(args)} {${query}}`,
    variables
  };
};

const bindProjections = (input: IBuildFieldInput): IQuery => {
  return {
    query: `${
      input.map.type === "interface" || input.map.type === "union"
        ? `... on `
        : ``
    }${input.map.entity} ${
      input.map.args
        ? `(${input.map.args.map((el: IArgs) => {
            const newIdentifier = input.identifier++;
            input.args["$var" + newIdentifier] = el.graphQlType;
            input.variables["var" + newIdentifier] = el.value;
            return `${el.name}: $var${newIdentifier}`;
          })}) `
        : ``
    }${
      input.map.project
        ? `{ ${input.map.project
            .map((el: IMap | string) => {
              if (typeof el === "string") {
                return `${el} `;
              }
              const { variables, query, args } = bindProjections({
                map: el,
                variables: input.variables,
                args: input.args,
                identifier: input.identifier
              });
              input.variables = { ...input.variables, ...variables };
              input.args = { ...input.args, ...args };
              return `${query}`;
            })
            .join(``)}} `
        : ``
    }`,
    variables: input.variables,
    args: input.args
  };
};

export { build, InputPayload };
