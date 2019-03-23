import { EmptyConstructor, Maybe, TypeWrapper } from './types';

export type VariableDefinition<TType, TValue, TDefaultValue extends Maybe<TValue> = Maybe<TValue>> = TypeWrapper<TType, TValue> & {
  defaultValue?: TValue,
};

export type VariableDefinitionMap = {
  [key: string]: VariableDefinition<any, any>
}

export class Variable<TType, TValue> {
  type: TType;
  valueType: TValue;
  gqlType: string;
  name: string;

  constructor(name: string, wrapper: VariableDefinition<TType, TValue>) {
    this.name = name;
    this.type = wrapper.type;
    this.valueType = wrapper.valueType;
    this.gqlType = wrapper.gqlType;
  }
}

export type VariableMap<T extends VariableDefinitionMap> = {
  [key in keyof T]: T[key] extends VariableDefinition<infer TType, infer TValue> ? Variable<TType, TValue> : never
};

export type VariableMapValues<T extends VariableMap<any>> = {
  [key in keyof T]: T[key] extends Variable<any, infer V> ? V : never
};

export abstract class InputType<TArg, TValue> {
  argType!: TArg
  value!: TValue
}

export const wrap = <T, V>(gqlType: string): TypeWrapper<Maybe<T>, Maybe<V>> => ({
  gqlType,
  type: null as unknown as Maybe<T>,
  valueType: null as unknown as Maybe<V>
});

export const variable = <TArg, TFields>(type: EmptyConstructor<InputType<TArg, TFields>>, gqlType?: string): VariableDefinition<Maybe<TArg>, Maybe<TFields>> => ({
  gqlType: gqlType || type.name,
  valueType: null as unknown as Maybe<TFields>,
  type: null as unknown as Maybe<TArg>,
});

export const defaultValue = <T, V>(def: VariableDefinition<T, V>, value: V): VariableDefinition<T, V, V> => ({
  ...def,
  defaultValue: value,
});

export const nonNull = <T, V>(type: TypeWrapper<T, V>): VariableDefinition<NonNullable<T>, NonNullable<V>> => ({
  gqlType: `${type.gqlType}!`,
  valueType: null as unknown as NonNullable<V>,
  type: null as unknown as NonNullable<T>,
});

export const list = <T, V>(type: VariableDefinition<T, V>): VariableDefinition<Maybe<Array<T>>, Maybe<Array<V>>> => ({
  gqlType: `[${type.gqlType}]`,
  valueType: null as unknown as Maybe<Array<V>>,
  type: null as unknown as Maybe<Array<T>>,
});
