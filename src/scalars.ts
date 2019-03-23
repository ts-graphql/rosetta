import { InputType, variable } from './variables';
import { TypeWrapper } from './types';

export class StringType {
  name: 'String' = 'String';
}

export class StringInput extends InputType<StringType, string> {
  argType!: StringType;
  value!: string;
}

export class IntType {
  name: 'Int' = 'Int';
}

export class IntInput extends InputType<IntType, number> {}

export class FloatType {
  name: 'Float' = 'Float';
}

export class FloatInput extends InputType<FloatType, number> {}

export class BooleanType {
  name: 'Boolean' = 'Boolean';
}

export class BooleanInput extends InputType<BooleanType, boolean> {}

export class IDType {
  name: 'ID' = 'ID';
}

export class IDInput extends InputType<IDType, string | number> {}

export type GQLStringArg = TypeWrapper<StringType, string>;
export type GQLIntArg = TypeWrapper<IntType, number>;
export type GQLFloatArg = TypeWrapper<FloatType, number>;
export type GQLBooleanArg = TypeWrapper<BooleanType, boolean>;
export type GQLIDArg = TypeWrapper<IDType, string | number>;

export const GQLString = variable(StringInput, 'String');
export const GQLInt = variable(IntInput, 'Int');
export const GQLFloat = variable(FloatInput, 'Float');
export const GQLBoolean = variable(BooleanInput, 'Boolean');
export const GQLID = variable(IDInput, 'ID');
