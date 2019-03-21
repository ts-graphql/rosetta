import { Args, Document, QueryField, QueryObjectType } from './types';
import { VariableDefinitionMap, Variable } from './variables';

export const print = (document: Document<any, QueryObjectType<any>>): string => {
  const { type, name, variables, query } = document;
  const output = [];
  output.push(`${type} ${name ? `${name}` : ''}${variables ? `(${printVariables(variables)})` : ''} {`);
  output.push(...linesForFields(query));
  output.push('}');

  return output.join('\n');
}

const printVariables = (variables: VariableDefinitionMap): string => {
  return Object.keys(variables)
    .map((key) => `$${key}: ${variables[key].gqlType}`)
    .join(', ');
}

const printArgs = (args: Args<any>): string => {
  return Object.keys(args)
    .map((key) => {
      const value = args[key];
      if (value instanceof Variable) {
        return `${key}: $${value.name}`
      }

      if (value && typeof value === 'object') {
        return `${key}: { ${printArgs(value)} }`;
      }

      return `${key}: ${JSON.stringify(value)}`;
    })
    .join(', ');
}

const linesForFields = (fieldMap: QueryObjectType<any>, indentation: string = '  '): string[] => {
  let output = [];
  for (const alias of Object.keys(fieldMap)) {
    output.push(...linesForField(alias, fieldMap[alias]));
  }
  return output.map((line) => `${indentation}${line}`);
}

const linesForField = (alias: string, field: QueryField<any, any, any, any>): string[] => {
  const { name, args, children } = field;
  const useAlias = alias !== name;
  const hasArgs = args && Object.keys(args).length > 0;
  const hasChildren = children && Object.keys(children).length > 0;

  const output = [];
  output.push(`${useAlias ? `${alias}: ` : ''}${name}${hasArgs ? `(${printArgs(args)})` : ''}${hasChildren ? ' {' : ''}`);

  if (hasChildren) {
    output.push(...linesForFields(field.children));
    output.push('}');
  }

  return output;
}
