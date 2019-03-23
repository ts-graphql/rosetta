import { branchField, branchFieldWithArgs, leafField, leafFieldWithArgs } from '../fields';
import { Maybe, TypeWrapper } from '../types';
import { operation } from '../operation';
import { GQLIntArg, GQLStringArg } from '../scalars';
import { InputType } from '../variables';
import { MaybeArg } from '../args';

export class Foo {
  maybeStr?: Maybe<string>
  bar!: Bar;
  maybeBar?: Bar | null;
  barArr!: Bar[];
  maybeBarArr?: Bar[] | null;
  maybeBarMaybeArr?: Array<Bar | null> | null;
}

export const maybeStr = leafField<Foo, 'maybeStr'>('maybeStr');
export const bar = branchField<Foo, 'bar', Bar>('bar');
export const maybeBar = branchField<Foo, 'maybeBar', Bar>('maybeBar');
export const barArr = branchField<Foo, 'barArr', Bar>('barArr');
export const maybeBarArr = branchField<Foo, 'maybeBarArr', Bar>('maybeBarArr');
export const maybeBarMaybeArr = branchField<Foo, 'maybeBarMaybeArr', Bar>('maybeBarMaybeArr');

export class Bar {
  str!: string;
  int!: number;
  float!: number;
  bool!: boolean;
}

export const str = leafField<Bar, 'str'>('str');
export const int = leafField<Bar, 'int'>('int');
export const float = leafField<Bar, 'float'>('float');
export const bool = leafFieldWithArgs<Bar, 'bool', { test?: MaybeArg<GQLStringArg> }>('bool');

export class Query {
  foo!: Foo;
  maybeFooArr?: Maybe<Array<Foo>>;
  fooRequiredArg!: Foo;
}

export type FooInputArg = {
  str: GQLStringArg,
  num: GQLIntArg,
}

export class FooInputFields {
  str!: string
  num!: number
}

export class FooInput extends InputType<FooInputArg, FooInputFields> {
  argType!: FooInputArg
  value!: FooInputFields
}

export const foo = branchFieldWithArgs<Query, 'foo', Foo, { nested?: MaybeArg<TypeWrapper<FooInputArg, FooInputFields>>, num?: MaybeArg<GQLIntArg> }>('foo');
export const maybeFooArr = branchFieldWithArgs<Query, 'foo', Foo, { nested?: MaybeArg<TypeWrapper<FooInputArg, FooInputFields>>, num?: MaybeArg<GQLIntArg> }>('foo');
export const fooRequiredArg = branchFieldWithArgs<Query, 'fooRequiredArg', Foo, { str: GQLStringArg }>('fooRequiredArg');

export const query = operation<Query>('query');
