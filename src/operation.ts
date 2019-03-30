import { Document, QueryObjectType, OperationType, EmptyConstructor } from './types';
import { Variable, VariableMap, VariableDefinitionMap } from './variables';

type QueryFunction<TVariables extends VariableDefinitionMap, TChildren> =
  (variables: VariableMap<TVariables>) => TChildren;

export interface OperationOverloads<TRoot, TType extends object> {
  <TChildren extends QueryObjectType<TType>>(query: TChildren): Document<TRoot, TChildren, null>;
  <TChildren extends QueryObjectType<TType>>(name: string, query: TChildren): Document<TRoot, TChildren, null>;
  <
    TVariables extends VariableDefinitionMap,
    TChildren extends QueryObjectType<TType>
  >(variables: TVariables, query: QueryFunction<TVariables, TChildren>): Document<TRoot, TChildren, null>;
  <
    TVariables extends VariableDefinitionMap,
    TChildren extends QueryObjectType<TType>
  >(name: string, variables: TVariables, query: QueryFunction<TVariables, TChildren>): Document<TRoot, TChildren, null>;
}

export const operation = <TRoot extends object>(type: OperationType, rootType: EmptyConstructor<TRoot>): OperationOverloads<TRoot, TRoot> =>
  (...args: any[]) => {
  if (args.length === 1) {
    const [query] = args;
    return {
      type,
      rootType,
      query,
      variables: null,
    };
  }

  if (args.length === 2 && typeof args[1] === 'object') {
    const [name, query] = args;
    return {
      name,
      type,
      rootType,
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
    rootType,
    variables,
    query: query(variableMap),
  };
};
