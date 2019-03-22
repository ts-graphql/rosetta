import { branchField, branchFieldWithArgs, leafField, leafFieldWithArgs } from '../fields';
import { Maybe } from '../types';
import { operation } from '../operation';

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
export const bool = leafFieldWithArgs<Bar, 'bool', { test?: string }>('bool');

export class Query {
  foo!: Foo;
  maybeFooArr?: Maybe<Array<Foo>>;
  fooRequiredArg!: Foo;
}

export class FooInput {
  str!: string
  num!: number
}

export const foo = branchFieldWithArgs<Query, 'foo', Foo, { nested?: Maybe<FooInput>, num?: Maybe<number> }>('foo');
export const maybeFooArr = branchFieldWithArgs<Query, 'foo', Foo, { nested?: Maybe<FooInput>, num?: Maybe<number> }>('foo');
export const fooRequiredArg = branchFieldWithArgs<Query, 'fooRequiredArg', Foo, { str: string }>('fooRequiredArg');

export const query = operation<Query>('query');
