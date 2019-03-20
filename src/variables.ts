export type EmptyConstructor<T> = new () => T;

export type TypeWrapper<T> = {
  type: T;
  gqlType: string;
}

export type VariableDefinitionMap = {
  [key: string]: TypeWrapper<any>
}

export class Variable<T> {
  type: T;
  gqlType: string;
  name: string;

  constructor(name: string, wrapper: TypeWrapper<T>) {
    this.name = name;
    this.type = wrapper.type;
    this.gqlType = wrapper.gqlType;
  }
}

export type VariableMap<T extends VariableDefinitionMap> = {
  [key in keyof T]: T[key] extends TypeWrapper<infer V> ? Variable<V> : never
};

export type VariableMapValues<T extends VariableMap<any>> = {
  [key in keyof T]: T[key] extends Variable<infer V> ? V : never
};

export const wrap = <T>(gqlType: string): TypeWrapper<T | null> => ({
  gqlType,
  type: null as unknown as (T | null),
});

export const variable = <T>(type: EmptyConstructor<T>): TypeWrapper<T | null> => ({
  gqlType: type.name,
  type: null as unknown as T | null,
});

export const nonNull = <T>(type: TypeWrapper<T>): TypeWrapper<NonNullable<T>> => ({
  gqlType: `${type.gqlType}!`,
  type: undefined as unknown as NonNullable<T>,
});

export const list = <T>(type: TypeWrapper<T>): TypeWrapper<Array<T> | null> => ({
  gqlType: `[${type.gqlType}]`,
  type: undefined as unknown as Array<T>,
});
