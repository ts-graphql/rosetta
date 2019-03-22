import { EmptyConstructor, Variable } from './variables';

export type ArrayValue<A extends Array<any>> = A extends Array<infer V> ? V : never;

export type EnforceQueryObjectType<T> = T extends QueryObjectType<any> ? T : never;

export type RequireKeys<T extends object> = keyof T extends never ? never : T;

export type Maybe<T> = T | null;

export type ReturnedObjectTypeField<P, N extends keyof P, C> = P[N] extends Array<infer ArrayValue>
  ? ArrayValue extends object ? Array<ReturnedObjectType<EnforceQueryObjectType<C>>> : P[N]
  : P[N] extends object ? ReturnedObjectType<EnforceQueryObjectType<C>> : P[N];

export type ReturnedObjectType<T extends QueryObjectType<any>> = {
  [key in keyof T]: T[key] extends QueryField<infer P, infer N, any, infer C>
    ? ReturnedObjectTypeField<P, N, C>
    : T[key] extends NestedQueryField<any, infer F>
      ? F extends QueryField<infer P, infer N, any, infer C>
        ? ReturnedObjectTypeField<P, N, C>
        : never
      : never
}

export type QueryObjectTypeField<TParent, TKey extends keyof TParent> = TParent[TKey] extends Array<any>
  ? QueryField<Partial<TParent>, TKey, any, QueryChildren<ArrayValue<TParent[TKey]>>>
  : QueryField<Partial<TParent>, TKey, any>

export type QueryObjectTypeValue<T> =
  NestedQueryField<any, QueryObjectTypeField<T, keyof T>> | QueryObjectTypeField<T, keyof T>;

export type QueryObjectType<T> = {
  [key: string]: QueryObjectTypeValue<T>
};

export type QueryChildren<T> = T extends object ? QueryObjectType<T> : undefined;

export type QueryField<TParent, TName extends keyof TParent, TArgs = {}, TChildren extends QueryChildren<any> = QueryChildren<TParent[TName]>> = {
  name: TName,
  parent: TParent,
  type: TParent[TName],
  args: TArgs,
  children: TChildren,
  fragment?: Fragment<TChildren>,
};

export const isQueryField = (x: any): x is QueryField<any, any, any, any> => {
  return (
    'parent' in x &&
    'type' in x &&
    'args' in x &&
    'children' in x
  );
};

export type Fragment<TChildren extends QueryChildren<any>> = {
  onType: EmptyConstructor<any>,
  name?: string,
  fields: TChildren,
};

export type Args<T> = {
  [key in keyof T]: Variable<T[key]> | NestedArgs<T[key]>;
}

export type NestedArgs<T> = T extends object ? Args<T> : T;

export type NestedQueryField<TKey extends keyof any, TField> = {
  [key in TKey]: TField
};

export type OperationType = 'query' | 'mutation' | 'subscription';

export type Document<TVariables, TQuery extends QueryObjectType<any>> = {
  type: OperationType,
  name?: string,
  variables: TVariables,
  query: TQuery,
}
