export type EmptyConstructor<T> = new () => T;

export type ArrayValue<A extends Array<any>> = A extends Array<infer V> ? V : never;

export type EnforceQueryObjectType<T> = T extends QueryObjectType<any> ? T : never;

export type RequireKeys<T extends object> = keyof T extends never ? never : T;

export type Maybe<T> = T | null | undefined;

export type TypeWrapper<TType, TValue = TType> = {
  type: TType;
  valueType: TValue;
  gqlType: string;
};

type BuiltInField = QueryField<any, any, any, any, true>;

export type ReturnedObjectTypeField<TRoot, TName, TChildren> = TName extends keyof TRoot
  ? TRoot[TName] extends Array<infer ArrayValue>
    ? ArrayValue extends object
      ? Array<ReturnedObjectType<EnforceQueryObjectType<TChildren>, ArrayValue>>
      : TRoot[TName]
    : TRoot[TName] extends object
      ? ReturnedObjectType<EnforceQueryObjectType<TChildren>, TRoot[TName]>
      : TRoot[TName]
  : never;

export type ReturnedObjectType<T extends QueryObjectType<any>, Q> = {
  [key in keyof T]: T[key] extends QueryField<infer P, infer N, any, infer C>
    ? T[key] extends BuiltInField ? ReturnedObjectTypeField<P, N, C> : ReturnedObjectTypeField<Q, N, C>
    : T[key] extends NestedQueryField<any, infer F>
      ? F extends QueryField<infer P, infer N, any, infer C>
        ? F extends BuiltInField ? ReturnedObjectTypeField<P, N, C> : ReturnedObjectTypeField<Q, N, C>
        : never
      : never
};

export type QueryObjectTypeField<TParent, TKey extends keyof TParent> = TParent[TKey] extends Array<any>
  ? QueryField<Partial<TParent>, TKey, any, QueryChildren<ArrayValue<TParent[TKey]>>>
  : QueryField<Partial<TParent>, TKey, any>

export type QueryObjectTypeValue<T> =
  NestedQueryField<any, QueryObjectTypeField<T, keyof T>> | QueryObjectTypeField<T, keyof T>;

export type QueryObjectType<T> = {
  [key: string]: QueryObjectTypeValue<T>
};

export type QueryChildren<T> = T extends object ? QueryObjectType<T> : undefined;

export type QueryField<
  TParent,
  TName extends keyof TParent,
  TArgs = {},
  TChildren extends QueryChildren<any> = QueryChildren<TParent[TName]>,
  TBuiltIn extends boolean = boolean,
> = {
  name: TName,
  parent: TParent,
  type: TParent[TName],
  args: TArgs,
  children: TChildren,
  fragment?: Fragment<TChildren>,
  builtIn: TBuiltIn,
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

export type NestedQueryField<TKey extends keyof any, TField> = {
  [key in TKey]: TField
};

export type OperationType = 'query' | 'mutation' | 'subscription';

export type Document<TRoot, TQuery extends QueryObjectType<any>, TVariables> = {
  type: OperationType,
  rootType: EmptyConstructor<TRoot>,
  name?: string,
  variables: TVariables,
  query: TQuery,
}

export type DocumentReturnValue<T extends Document<any, any, any>> = T extends Document<infer TRoot, infer TQuery, any>
  ? ReturnedObjectType<TQuery, TRoot>
  : never;
