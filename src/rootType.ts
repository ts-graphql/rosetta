import { Document, QueryObjectType, RootType } from './types';
import { Variable, VariableMap, VariableDefinitionMap } from './variables';

export const rootType = <TType extends object>(type: RootType) => <
  TVariables extends VariableDefinitionMap,
  TChildren extends QueryObjectType<TType>,
  >(
  name: string,
  variables: TVariables,
  query: (variables: VariableMap<TVariables>) => TChildren,
): Document<TVariables, TChildren> => {
  const variableMap = {} as VariableMap<TVariables>;
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
