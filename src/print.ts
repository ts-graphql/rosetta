import { Document, Fragment, isQueryField, QueryField, QueryObjectType, QueryObjectTypeValue } from './types';
import { VariableDefinitionMap, Variable, VariableDefinition } from './variables';
import { Args } from './args';

export const print = (document: Document<any, QueryObjectType<any>, any>): string => {
  const { type, name, variables, query } = document;
  const output = [];
  output.push(
    [type, `${name ? `${name}` : ''}${variables ? `(${printVariables(variables)})` : ''}`, '{']
      .filter((val) => !!val)
      .join(' ')
  );
  output.push(...linesForFields(query));
  output.push('}');

  const namedFragments = getNamedFragments(query);

  const nameMap: { [key: string]: boolean } = {};

  for (const fragment of namedFragments) {
    if (nameMap[fragment.name!]) {
      throw new Error('Cannot use different fragments with same name');
    }
    nameMap[fragment.name!] = true;
    output.push('', ...linesForNamedFragment(fragment));
  }

  return output.join('\n');
}

const printVariables = (variables: VariableDefinitionMap): string => {
  return Object.keys(variables)
    .map((key) => printVariable(key, variables[key]))
    .join(', ');
}

const printVariable = (name: string, variable: VariableDefinition<any, any, any>): string => {
  let value = `$${name}: ${variable.gqlType}`;
  if (variable.defaultValue) {
    value += `${variable.defaultValue ? ` = ${printArgValue(variable.defaultValue)}` : ''}`
  }
  return value;
}

const printArgs = (args: Args<any>): string => {
  return Object.keys(args)
    .map((key) => {
      const value = args[key];
      return `${key}: ${printArgValue(value)}`;
    })
    .join(', ');
}

const printArgValue = (value: any): string => {
  if (value instanceof Variable) {
    return `$${value.name}`;
  }

  if (value && typeof value === 'object') {
    return `{ ${printArgs(value)} }`;
  }

  return JSON.stringify(value);
}

const resolveFieldForValue = (value: QueryObjectTypeValue<any>): QueryField<any, any, any, any> => {
  return isQueryField(value)
    ? value
    : value[Object.keys(value)[0]];
}

const linesForFields = (fieldMap: QueryObjectType<any>, indentation: string = '  '): string[] => {
  const output = [];
  const printedFragments: Array<Fragment<QueryObjectType<any>>> = [];
  for (const alias of Object.keys(fieldMap)) {
    const field = resolveFieldForValue(fieldMap[alias]);
    const { fragment } = field;
    if (fragment) {
      if (printedFragments.indexOf(fragment) !== -1) {
        continue;
      }
      printedFragments.push(fragment);
      output.push(...(fragment.name
        ? [`...${fragment.name}`]
        : linesForInlineFragment(fragment))
      );
      continue;
    }
    output.push(...linesForField(alias, field));
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

const linesForInlineFragment = (fragment: Fragment<QueryObjectType<any>>) => {
  return [
    `...on ${fragment.onType.name} {`,
    ...linesForFields(fragment.fields),
    `}`,
  ];
}

const linesForNamedFragment = (fragment: Fragment<QueryObjectType<any>>) => {
  return [
    `fragment ${fragment.name!} {`,
    ...linesForFields(fragment.fields),
    `}`,
  ];
}

const getNamedFragments = (map: QueryObjectType<any>, alreadyProcessed: Array<Fragment<QueryObjectType<any>>> = []): Array<Fragment<QueryObjectType<any>>> => {
  const processed = [...alreadyProcessed];
  const fragments = [];
  for (const key of Object.keys(map)) {
    const field = resolveFieldForValue(map[key]);
    const fragment = field.fragment;
    if (fragment && processed.indexOf(fragment) === -1) {
      processed.push(fragment);
      fragments.push(...getNamedFragments(fragment.fields, processed));
      if (fragment.name) {
        fragments.push(fragment);
      }
      continue;
    }
    if (field.children) {
      fragments.push(...getNamedFragments(field.children, processed));
    }
  }
  return fragments;
}
