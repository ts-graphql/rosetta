import {
  Args,
  NestedQueryField,
  QueryChildren,
  QueryField,
  RequireKeys,
  isQueryField,
} from './types';

export const leafField = <
  TParent,
  TName extends keyof TParent
>(name: TName): QueryField<Pick<TParent, TName>, TName> => ({
  name,
  type: null as unknown as TParent[TName],
  args: {},
  parent: null as any,
  children: undefined as QueryChildren<TParent[TName]>,
});

export const leafFieldWithArgs = <
  TParent,
  TName extends keyof TParent,
  TArgs
>(name: TName) => (args: Args<TArgs>): NestedQueryField<TName, QueryField<Pick<TParent, TName>, TName, Args<TArgs>>> => ({
  [name]: {
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
  TArgs,
  >(name: TName) => <TSelectedChildren extends QueryChildren<TChildren>>(
  args: Args<TArgs>,
  children: RequireKeys<TSelectedChildren>,
): NestedQueryField<TName, QueryField<Pick<TParent, TName>, TName, Args<TArgs>, TSelectedChildren>> => ({
  [name]: {
    name,
    type: null as unknown as TParent[TName],
    args,
    parent: null as unknown as TParent,
    children: children as TSelectedChildren,
  },
} as NestedQueryField<TName, QueryField<TParent, TName, Args<TArgs>, TSelectedChildren>>);

export function alias<TName extends string, T extends QueryField<any, any, any, any>>(name: TName, field: T): NestedQueryField<TName, T>;
export function alias<TName extends string, T extends QueryField<any, any, any, any>>(name: TName, field: NestedQueryField<any, T>): NestedQueryField<TName, T>;
export function alias<TName extends string, T extends QueryField<any, any, any, any>>(name: TName, field: T | NestedQueryField<any, T>): NestedQueryField<TName, T> {
  return {
    [name]: isQueryField(field)
      ? field
      : field[Object.keys(field)[0]],
  } as NestedQueryField<TName, T>;
}
