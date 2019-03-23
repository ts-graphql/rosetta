import { Variable } from './variables';
import { Maybe, RequireKeys, TypeWrapper } from './types';

export type MaybeArg<T extends TypeWrapper<any, any>> = T extends TypeWrapper<infer T, infer V>
  ? TypeWrapper<Maybe<T>, Maybe<V>>
  : never;

export type ListArg<T extends TypeWrapper<any, any>> = T extends TypeWrapper<infer T, infer V>
  ? TypeWrapper<Array<T>, Array<V>>
  : never;

export type ArgsField<T> = T extends TypeWrapper<infer TType, infer TValue>
  ? Variable<TType, TValue> | NestedArgs<TType, TValue>
  : never;

export type Args<T extends object> = RequireKeys<T> extends never ? never : {
  [key in keyof T]: T[key] extends Array<infer ArrayValue>
    ? ArgsField<ArrayValue>
    : ArgsField<T[key]>
};

export type NestedArgs<TType, TValue> = TValue extends object
  ? TType extends object ? Args<TType> : never
  : TValue;
