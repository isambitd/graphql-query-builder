const types = {
  interface: "interface",
  union: "union"
};

const buildQuery = (obj: { [key: string]: any }) => {
  const { variables, newQuery, newHeader } = bindFields({
    obj: obj.data,
    variableObj: {},
    header: {},
    identifier: 1,
    level: 2
  });
  return {
    query: `${obj.type} ${obj.name} ${
      newHeader && Object.keys(newHeader).length
        ? `(${Object.keys(newHeader).map(key => `${key}: ${newHeader[key]}`)})`
        : ``
    } {\n${newQuery}}`,
    variables
  };
};
const bindFields = ({
  obj,
  variableObj,
  header,
  identifier,
  level
}: {
  obj: { [key: string]: any };
  variableObj: { [key: string]: any };
  header: { [key: string]: any };
  identifier: number;
  level: number;
}) => {
  return {
    newQuery: `${Array.from(Array(level))
      .map(x => `\t`)
      .join("")}${
      (obj.type && obj.type === types.union) || obj.type === types.interface
        ? `... on `
        : ``
    }${obj.name} ${
      obj.args
        ? `(${obj.args.map((el: any[]) => {
            const newIdentifier = identifier++;
            header["$x" + newIdentifier] = el[1];
            variableObj["x" + newIdentifier] = el[2];
            return `${el[0]}: $x${newIdentifier}`;
          })})`
        : ``
    }${
      obj.props
        ? `{\n${obj.props
            .map((el: string | { [key: string]: any }) => {
              if (typeof el === "string") {
                return `${Array.from(Array(level + 1))
                  .map(x => `\t`)
                  .join("")}${el}\n`;
              }
              const { variables, newQuery, newHeader } = bindFields({
                obj: el,
                variableObj,
                header,
                identifier,
                level: level + 1
              });
              variableObj = { ...variableObj, ...variables };
              header = { ...header, ...newHeader };
              return `${newQuery}`;
            })
            .join(``)}${Array.from(Array(level))
            .map(x => `\t`)
            .join("")}}`
        : ``
    }\n`,
    variables: variableObj,
    newHeader: header
  };
};

export { buildQuery };
