import {
  NestedQueryField,
  QueryChildren,
  QueryField,
  RequireKeys,
  Fragment,
  QueryObjectType,
  EmptyConstructor,
} from './types';
import { Args } from './args';

const baseParams = {
  fragment: undefined,
  builtIn: false,
}

export const leafField = <
  TParent,
  TName extends keyof TParent,
>(name: TName): QueryField<Pick<TParent, TName>, TName> => ({
  ...baseParams,
  name,
  type: null as unknown as TParent[TName],
  args: {},
  parent: null as unknown as TParent,
  children: undefined as QueryChildren<TParent[TName]>,
});

export const leafFieldWithArgs = <
  TParent,
  TName extends keyof TParent,
  TArgs extends object,
>(name: TName) => (args: Args<TArgs>): NestedQueryField<TName, QueryField<Pick<TParent, TName>, TName, Args<TArgs>>> => ({
  [name]: {
    ...baseParams,
    name,
    type: null as unknown as TParent[TName],
    args,
    parent: null as unknown as TParent,
    children: undefined as QueryChildren<TParent[TName]>,
  }
} as NestedQueryField<TName, QueryField<TParent, TName, Args<TArgs>>>);

export const branchField = <
  TParent,
  TName extends keyof TParent,
  TChildren extends object
  >(name: TName) => <
  TSelectedChildren extends QueryChildren<TChildren>
  >(children: RequireKeys<TSelectedChildren>): NestedQueryField<TName, QueryField<Pick<TParent, TName>, TName, {}, TSelectedChildren>> => ({
  [name]: {
    ...baseParams,
    name,
    type: null as unknown as TParent[TName],
    args: {},
    parent: null as unknown as TParent,
    children: children as TSelectedChildren,
  },
} as NestedQueryField<TName, QueryField<TParent, TName, {}, TSelectedChildren>>);

export const branchFieldWithArgs = <
  TParent,
  TName extends keyof TParent,
  TChildren extends object,
  TArgs extends object,
  >(name: TName) => <TSelectedChildren extends QueryChildren<TChildren>>(
  args: Args<TArgs>,
  children: RequireKeys<TSelectedChildren>,
): NestedQueryField<TName, QueryField<Pick<TParent, TName>, TName, Args<TArgs>, TSelectedChildren>> => ({
  [name]: {
    ...baseParams,
    name,
    type: null as unknown as TParent[TName],
    args,
    parent: null as unknown as TParent,
    children: children as TSelectedChildren,
    fragment: undefined,
  },
} as NestedQueryField<TName, QueryField<TParent, TName, Args<TArgs>, TSelectedChildren>>);

interface FragmentOverloads {
  <
    TChildren extends object,
    TSelectedChildren extends QueryChildren<TChildren>,
  >(onType: EmptyConstructor<TChildren>, fields: RequireKeys<TSelectedChildren>): TSelectedChildren;
  <
    TChildren extends object,
    TSelectedChildren extends QueryChildren<TChildren>,
  >(name: string, onType: EmptyConstructor<TChildren>, fields: RequireKeys<TSelectedChildren>): TSelectedChildren
}

export const fragment: FragmentOverloads = (...args: any[]) => {
  const [name, onType, fields] = args.length === 3
    ? args
    : [undefined, ...args];
  const f: Fragment<QueryObjectType<any>> = {
    name,
    onType,
    fields,
  };
  const mappedObj: any = {};
  for (const key of Object.keys(fields)) {
    mappedObj[key] = {
      ...fields[key],
      fragment: f,
    } as QueryField<any, any, any, any>;
  }
  return mappedObj;
}

export const __typename: QueryField<
  Record<any, string>,
  any,
  {},
  undefined,
  true
> = {
  name: '__typename',
  parent: null as unknown as Record<any, string>,
  type: null as unknown as string,
  args: {},
  children: undefined,
  fragment: undefined,
  builtIn: true,
}
