import { Document, QueryObjectType, OperationType } from './types';
import { Variable, VariableMap, VariableDefinitionMap } from './variables';

type QueryFunction<TVariables extends VariableDefinitionMap, TChildren> =
  (variables: VariableMap<TVariables>) => TChildren;

export interface OperationOverloads<TType extends object> {
  <TChildren extends QueryObjectType<TType>>(query: TChildren): Document<null, TChildren>;
  <TChildren extends QueryObjectType<TType>>(name: string, query: TChildren): Document<null, TChildren>;
  <
    TVariables extends VariableDefinitionMap,
    TChildren extends QueryObjectType<TType>
  >(variables: TVariables, query: QueryFunction<TVariables, TChildren>): Document<TVariables, TChildren>;
  <
    TVariables extends VariableDefinitionMap,
    TChildren extends QueryObjectType<TType>
  >(name: string, variables: TVariables, query: QueryFunction<TVariables, TChildren>): Document<TVariables, TChildren>;
}

export const operation = <TType extends object>(type: OperationType): OperationOverloads<TType> =>
  (...args: any[]) => {
  if (args.length === 1) {
    const [query] = args;
    return {
      type,
      query,
      variables: null,
    };
  }

  if (args.length === 2 && typeof args[1] === 'object') {
    const [name, query] = args;
    return {
      type,
      name,
      query,
      variables: null,
    };
  }

  const [name, variables, query] = args.length === 3
    ? args
    : [undefined, ...args];

  const variableMap = {} as VariableMap<any>;
  for (const key of Object.keys(variables)) {
    variableMap[key] = new Variable(key, variables[key]) as any;
  }

  return {
    name,
    type,
    variables,
    query: query(variableMap),
  };
};
